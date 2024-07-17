const {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} = require('@aws-sdk/client-bedrock-runtime');
const dotenv = require('dotenv');
const catchAsync = require('../utils/catchAsync');
const LLMServices = require('../services/llm.service');
const config = require('../config/config');
const axios = require('axios');
const etasAuthorizationData = require('../states/etasAuthorization');
const moment = require('moment');

dotenv.config();

const publicKey = process.env.AWS_PUBLIC_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

function extractRegion(url) {
  const regionPattern = /bedrock-runtime\.([a-z0-9-]+)\.amazonaws\.com/;
  const match = url.match(regionPattern);
  return match ? match[1] : null;
}

function extractModelId(url) {
  const modelIdPattern = /model\/(.*?)(\/|$)/;
  const match = url.match(modelIdPattern);
  return match ? match[1] : null;
}

function generatePayload(modelId, inputPrompt, systemPrompt) {
  const modelPrefix = modelId.split('.')[0];
  switch (modelPrefix) {
    case 'amazon':
      return {
        inputText: `"System": ${systemPrompt ? systemPrompt : ''} "User": ${inputPrompt}\n`,
        textGenerationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxTokenCount: 4096,
          stopSequences: [],
        },
      };
    case 'anthropic':
      return {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 4096,
        system: systemPrompt ? systemPrompt : '',
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: inputPrompt }],
          },
        ],
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        stop_sequences: [],
      };
    case 'meta':
      return {
        prompt: `"System": ${systemPrompt ? systemPrompt : ''} "User": ${inputPrompt}\:`,
        temperature: 0.7,
        top_p: 0.9,
        max_gen_len: 2048,
      };
    case 'mistral':
      return {
        prompt: `"System": ${systemPrompt ? systemPrompt : ''} "User": ${inputPrompt}\:`,
        max_tokens: 4096,
        stop: [],
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
      };
    case 'cohere':
      return {
        prompt: `"System": ${systemPrompt ? systemPrompt : ''} "User": ${inputPrompt}\:`,
        temperature: 0.7,
        p: 0.9,
        k: 40,
        max_tokens: 4096,
        stop_sequences: [],
        return_likelihoods: 'NONE',
        stream: true,
        num_generations: 1,
        truncate: 'NONE',
      };
    case 'ai21':
      return {
        prompt: `"System": ${systemPrompt ? systemPrompt : ''} "User": ${inputPrompt}\:`,
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 4096,
        stopSequences: [],
        countPenalty: {
          scale: 0.0,
        },
        presencePenalty: {
          scale: 0.0,
        },
        frequencyPenalty: {
          scale: 0.0,
        },
      };
    default:
      throw new Error(`Unsupported model ID: ${modelId}`);
  }
}

async function BedrockGenCode({ endpointURL, publicKey, secretKey, inputPrompt, systemMessage }) {
  let region = extractRegion(endpointURL) || 'us-east-1';
  let modelId = extractModelId(endpointURL) || '';

  const awsConfig = {
    credentials: {
      accessKeyId: config.aws.publicKey,
      secretAccessKey: config.aws.secretKey,
    },
    region: region,
  };

  const bedrock = new BedrockRuntimeClient(awsConfig);
  const payload = generatePayload(modelId, inputPrompt, systemMessage);

  const input = {
    accept: 'application/json',
    contentType: 'application/json',
    modelId,
    body: JSON.stringify(payload),
  };

  let generation = '';

  try {
    const bedrockResponse = await bedrock.send(new InvokeModelWithResponseStreamCommand(input));

    if (!bedrockResponse.body) {
      throw new Error('Failed to get readable stream from response');
    }

    for await (const item of bedrockResponse.body) {
      const chunk = JSON.parse(new TextDecoder().decode(item.chunk?.bytes));
      const modelPrefix = modelId.split('.')[0];

      switch (modelPrefix) {
        case 'amazon':
          generation += chunk.outputText;
          break;
        case 'anthropic':
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            generation += chunk.delta.text;
          }
          break;
        case 'meta':
          generation += chunk.generation;
          break;
        case 'mistral':
          generation += chunk.outputs[0].text;
          break;
        case 'cohere':
          generation += chunk.text;
          break;
        case 'ai21':
          generation += chunk.completions[0].data.text;
          break;
        default:
          console.warn(`Unhandled model prefix: ${modelPrefix}`);
      }
    }
  } catch (error) {
    try {
      const bedrockResponse = await bedrock.send(new InvokeModelCommand(input));
      const response = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
      if (modelId.startsWith('ai21')) {
        generation = response.completions[0].data.text;
      }
    } catch (err) {
      throw new Error('Failed to generate response from Bedrock, please check your endpoint URL, region, keys');
    }
  }
  return generation;
}

async function invokeBedrockModel(req, res) {
  const { endpointURL, inputPrompt, systemMessage } = req.body;

  try {
    const generation = await BedrockGenCode({ endpointURL, publicKey, secretKey, inputPrompt, systemMessage });
    if (req.query.nested) {
      res.json({ code: generation });
    } else {
      res.json(generation);
    }
  } catch (error) {
    console.error('Failed to generate response from Bedrock:', error);
    res.status(500).json({ error: 'Failed to generate response from Bedrock' });
  }
}

const invokeOpenAIController = catchAsync(async (req, res) => {
  const { inputPrompt, systemMessage } = req.body;
  let result = '';

  await new Promise((resolve) => {
    LLMServices.OpenAIGenCode({
      inputPrompt,
      systemMessage: systemMessage || '',
      setGenCode: (code) => (result = code),
      onFinish: resolve,
      setLoading: () => {},
      setIsFinished: () => {},
    });
  });

  res.send(result);
});

const getAccessToken = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', config.etas.clientId || '');
  params.append('client_secret', config.etas.clientSecret || '');
  params.append('scope', config.etas.scope || '');

  // console.log('ETAS_CLIENT_ID', config.etas.clientId);
  // console.log('ETAS_CLIENT_SECRET', config.etas.clientSecret);
  // console.log('ETAS_SCOPE', config.etas.scope);

  try {
    const response = await axios.post(
      'https://p2.authz.bosch.com/auth/realms/EU_CALPONIA/protocol/openid-connect/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );

    // console.log('Authorization response:', response.data);

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
    };
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to fetch token');
  }
};

const generateAIContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const authorizationData = etasAuthorizationData.getAuthorizationData();
    let token = authorizationData.accessToken;
    if (!token || moment().diff(authorizationData.createdAt, 'seconds') >= authorizationData.expiresIn) {
      const authorizationData = await getAccessToken();
      token = authorizationData.accessToken;
      etasAuthorizationData.setAuthorizationData({
        ...authorizationData,
        createdAt: new Date(),
      });
    }

    const instance = config.etas.instanceEndpoint;

    // console.log('ETAS_INSTANCE_ENDPOINT', instance);

    const response = await axios.post(
      `https://${instance}/r2mm/GENERATE_AI`,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error generating AI content:', error?.response || error);
    if (axios.isAxiosError(error)) {
      return res.status(error.response.status || 502).json(error.response.data);
    }
    return res.status(500).json({ error: 'Failed to generate AI content' });
  }
};

module.exports = {
  invokeBedrockModel,
  BedrockGenCode,
  extractRegion,
  extractModelId,
  generatePayload,
  invokeOpenAIController,
  getAccessToken,
  generateAIContent,
};

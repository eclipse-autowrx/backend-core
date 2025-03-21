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
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const _ = require('lodash');
const mongoose = require('mongoose');
const { apiService } = require('../services');

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
    console.log('Error in BedrockGenCode');
    console.log(error);
    try {
      const bedrockResponse = await bedrock.send(new InvokeModelCommand(input));
      const response = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
      if (modelId.startsWith('ai21')) {
        generation = response.completions[0].data.text;
      }
    } catch (err) {
      throw err;
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

const getInstance = (environment = 'prod') => {
  switch (environment) {
    case 'prod':
      return config.etas.instanceEndpoint;
    case 'dev':
      return config.etas.developmentEndpoint;
    default:
      return config.etas.instanceEndpoint;
  }
};

const generateAIContent = async (req, res) => {
  try {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('');
    res.flush();

    const { environment } = req.params;
    const authorizationData = await etasAuthorizationData.getAuthorizationData();
    const token = authorizationData.accessToken;

    const abortController = new AbortController();
    req.on('close', () => {
      logger.info('Stream request closed by client');
      abortController.abort();
    });

    const instance = getInstance(environment);
    const response = await axios.post(`https://${instance}/generation`, req.body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'stream',
      abortController: abortController.signal,
    });

    const stream = response.data;
    stream.on('data', (data) => {
      res.write(data);
      res.flush();
    });
    stream.on('end', () => {
      res.end();
    });
    stream.on('error', (streamError) => {
      logger.error('Error while streaming content response from GenAI:', streamError);
      res.write(`data: ${JSON.stringify({ code: 500, message: 'Error while streaming data from GenAI' })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('Error generating AI content:', error?.response || error);
    res.write(
      `data: ${JSON.stringify({
        code: 500,
        message: 'Error generating AI content',
      })}\n\n`
    );
    res.end();
  }
};

const updateProfile = catchAsync(async (req, res) => {
  const authorizationData = await etasAuthorizationData.getAuthorizationData();
  const token = authorizationData.accessToken;

  const { environment, profileId } = req.params;
  const instance = getInstance(environment);

  let reqBody = req.body;
  if (!reqBody || _.isEmpty(reqBody)) {
    if (mongoose.isValidObjectId(profileId)) {
      const modelApi = await apiService.computeVSSApi(profileId);
      if (!modelApi || _.isEmpty(modelApi)) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Cannot compute VSS API from model ID ${profileId}`);
      }
      reqBody = {
        vss: modelApi,
      };
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing request body');
    }
  }

  try {
    const response = await axios.put(`https://${instance}/profiles/${profileId}`, reqBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.status(httpStatus.OK).send(response.data);
  } catch (error) {
    logger.error(`Error update profile: %o`, error?.response?.data || error);
    throw new ApiError(httpStatus.BAD_GATEWAY, 'Error updating profile');
  }
});

module.exports = {
  invokeBedrockModel,
  BedrockGenCode,
  extractRegion,
  extractModelId,
  generatePayload,
  invokeOpenAIController,
  generateAIContent,
  updateProfile,
};

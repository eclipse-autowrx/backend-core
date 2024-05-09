const httpStatus = require('http-status');
const { Timestamp } = require('firebase-admin/firestore');
const { auth, db } = require('../../config/firebase');
const { TENANT_ID } = require('../permissions/index');
const ApiError = require('../../utils/ApiError');

const registerNewUser = async (req, res) => {
  try {
    if (req.method !== 'POST' || !req.body) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request!');
    }

    const request = req.body;

    if (!request.email || !request.pwd || !request.name) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Missing email, pwd, name or captcha');
    }

    // Uncomment the captcha verification if required
    // const { data } = await axios.get(
    //   `https://google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${request.captcha}`
    // );
    // if (!data || !data.success) {
    //   throw 'Captcha invalid!';
    // }

    const dbUsers = await db
      .collection('user')
      .where('tenant_id', '==', TENANT_ID)
      .where('email', '==', request.email)
      .where('provider', '==', 'Email')
      .get();

    if (!dbUsers.empty) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists! Please log in!');
    }

    const userRecord = await auth.createUser({
      email: request.email,
      emailVerified: false,
      password: request.pwd,
    });

    await db
      .collection('user')
      .doc(userRecord.uid)
      .set({
        tenant_id: TENANT_ID,
        uid: userRecord.uid,
        roles: {},
        name: request.name ?? '',
        email: request.email,
        provider: 'Email',
        image_file: '/imgs/profile.png',
        created_time: Timestamp.now(),
      });

    res.status(200).json({ message: 'User created successfully!' });
    // sendEmailVerification(res.user, {
    //   url: `${callFrom}/account-verification-success?email=${email}`,
    // });
  } catch (error) {
    res.status(400).json(String(error));
  }
};

module.exports = {
  registerNewUser,
};

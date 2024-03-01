import { nanoid, customAlphabet } from "nanoid";
import { OAuth2Client } from "google-auth-library";
import userModel from "../../../../DB/models/UserModel.js";
import asyncHandler from "../../../utils/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/generarteAndVerifyToken.js";
import { compare, hash } from "../../../utils/hashAndCompare.js";
import sendEmail from "../../../utils/sendEmail.js";

//signup
export const signup = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (await userModel.findOne({ email })) {
    return next(new Error("email already exists", { cause: 400 }));
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.SIGNATURE,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const html = `<a href=${link} style="color:red;">confirm email</a>`;
  if (!sendEmail({ to: email, subject: "Confirm Email", html })) {
    return next(new Error("failed to send email", { cause: 400 }));
  }
  req.body.password = hash({ plaintext: req.body.password });
  const newUser = await userModel.create(req.body);
  return res.status(201).json({ msg: "created", newUser });
});

//confirmEamil
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, signature: process.env.SIGNATURE });
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.redirect("https://www.linkedin.com/feed/");
  }
  if (user.confirmEmail) {
    return res.redirect(
      "https://www.facebook.com/groups/562231568341852/?ref=share&mibextid=KtfwRi"
    );
  }
  user.confirmEmail = true;
  await user.save();
  return res.redirect(
    "https://www.facebook.com/groups/562231568341852/?ref=share&mibextid=KtfwRi"
  );
});

//login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid credentials", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("please confirm your email", { cause: 404 }));
  }
  if (user.isDeleted) {
    user.isDeleted = false;
  }
  const match = compare({ plaintext: password, hashValue: user.password });
  if (!match) {
    return next(new Error("invalid credentials", { cause: 400 }));
  }
  user.status = "Online";
  await user.save();
  const token = generateToken({
    payload: { email, id: user._id, role: user.role, status: user.status },
  });
  return res.status(200).json({ msg: "done", token });
});

//send otp in mail
export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid email", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("please confirm email", { cause: 400 }));
  }
  const nanId = customAlphabet("1234567890", 5);
  const code = nanId();
  if (
    !sendEmail({
      to: email,
      subject: "forget password",
      html: `<h1>${code}</h1>`,
    })
  ) {
    return next(new Error("faill to send email", { cause: 400 }));
  }
  user.code = code;
  await user.save();
  return res.status(200).json({ msg: "check your email" });
});

//forget password
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid email", { cause: 404 }));
  }
  if (code != user.code) {
    return next(new Error("invalid code", { cause: 400 }));
  }
  let newPassword = hash({ plaintext: req.body.password });
  user.password = newPassword;
  user.code = null;
  user.status = "Offline";
  await user.save();
  return res.status(200).json({ msg: "done", user });
});

//login with gmail
export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const client = new OAuth2Client();
  async function verify() {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { name, picture, email, email_verified } = await verify();

  const user = await userModel.findOne({ email });

  if (!user) {
    //signUp
    const newUser = await userModel.create({
      userName: name,
      email,
      confirmEmail: email_verified,
      password: nanoid(6),
      image: {
        secure_url: picture,
      },
      status: "Online",
      provider: "Google",
    });
    const token = generateToken({
      payload: { email, id: newUser._id, role: newUser.role },
    });
    return res.status(201).json({ message: "done", token });
  }
  //login
  if (user.provider == "Google") {
    user.status = "Online";
    await user.save();
    const token = generateToken({
      payload: { email, id: user._id, role: user.role },
    });
    return res.status(200).json({ message: "done", token });
  }
  return next(new Error("invalid provider System login with gmail"));
});

// export const refreshToken = asyncHandler(async (req, res, next) => {
//   const { token } = req.params;
//   const { email } = verifyToken({
//     token,
//     signature: process.env.EMAIL_SIGNATURE,
//   });
//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return res.redirect("https://www.linkedin.com/feed/");
//   }
//   if (user.confirmEmail) {
//     return res.redirect(
//       "https://www.facebook.com/groups/562231568341852/?ref=share&mibextid=KtfwRi"
//     );
//   }
//   const newToken = generateToken({
//     payload: { email },
//     signature: process.env.EMAIL_SIGNATURE,
//     expiresIn: 60 * 10,
//   });
//   const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
//   const html = `<a href=${link} style="color:red;">confirm email</a>`;
//   //return true or false
//   if (!sendEmail({ to: email, subject: "confirm email", html })) {
//     return next(new Error("faill to send email", { cause: 400 }));
//   }

//   return res.send("<h1>Cheack your email</h1>");
// });

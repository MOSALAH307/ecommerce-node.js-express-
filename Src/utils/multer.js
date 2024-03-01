import multer from "multer";

export const validationTypes = {
  image: ["image/jpeg", "image/png", "image/gif"],
  file: ["application/pdf", "application/msword"],
  video: ["video/mp4"],
};

const uploadFileCloud = (customValidation = []) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid format"), false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};

export default uploadFileCloud;

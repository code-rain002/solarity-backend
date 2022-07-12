import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  params: {
    bucket: process.env.AWS_S3_BUCKET_NAME,
  },
});

export const uploadImage = (folder = "") =>
  multer({
    storage: multerS3({
      s3,
      acl: "public-read",
      bucket: process.env.AWS_S3_BUCKET_NAME + folder,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error: Allow images only of extensions jpeg|jpg|png !");
      }
    },
  });

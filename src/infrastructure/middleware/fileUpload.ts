import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

const s3 = new S3Client({
  credentials: {
    secretAccessKey: "zl/TCuzABpntkXgF6x4uZLogHgFIOZ0vmRL9dtUn",
    accessKeyId: "AKIA3FLD5WQRZDJUM334",
  },
  region: "us-east-1",
});

const storage = multerS3({
  s3: s3,
  bucket: 'gingerappbucket1',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images only (jpeg, jpg, png, gif, mp4, mov)!'));
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;

import AWS from "aws-sdk";

const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;
const ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_AWS_REGION;

if (!BUCKET_NAME) {
  throw new Error("S3 Bucket name is not set in environment variables.");
}
if (!ACCESS_KEY_ID) {
  throw new Error("AWS Access Key ID is not set in environment variables.");
}
if (!SECRET_ACCESS_KEY) {
  throw new Error("AWS Secret Access Key is not set in environment variables.");
}
if (!REGION) {
  throw new Error("AWS Region is not set in environment variables.");
}

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION,
});

const s3 = new AWS.S3();

export const getSignedImageUrl = (key: string): string => {
  return s3.getSignedUrl("getObject", {
    Bucket: BUCKET_NAME,
    Key: key,
  });
};

import AWS from 'aws-sdk';

const BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;

if (!BUCKET_NAME) {
    throw new Error('S3 Bucket name is not set in environment variables.');
}

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1'
});

const s3 = new AWS.S3();

export const getSignedImageUrl = (key: string): string => {
    return s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: key
    });
};

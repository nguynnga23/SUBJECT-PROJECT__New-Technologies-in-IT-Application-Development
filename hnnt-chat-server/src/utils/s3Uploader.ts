import AWS from 'aws-sdk';
require('dotenv').config();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // Fallback to an empty string
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || '',
});

export const uploadToS3 = async (base64Image: string, key: string) => {
    if (!process.env.AWS_S3_BUCKET_NAME) {
        throw new Error('AWS_S3_BUCKET_NAME is not defined in environment variables');
    }

    const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    return s3
        .upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME, // Ensure this is defined
            Key: key,
            Body: buffer,
            ContentType: 'image/jpeg',
        })
        .promise();
};

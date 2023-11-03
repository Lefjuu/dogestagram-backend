const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    HeadBucketCommand,
    GetObjectCommand
} = require('@aws-sdk/client-s3');
const { Buffer } = require('buffer');
const {
    AWS_BUCKET_REGION,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_BUCKET_NAME
} = require('../config');

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

function extractUUIDFromURL(url) {
    const regex = /\/([a-fA-F0-9-]+)\.png$/;
    const match = url.match(regex);
    if (match && match[1]) {
        return `${match[1]}.png`;
    } else {
        return null;
    }
}

exports.uploadFile = async (file, fileId) => {
    try {
        const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const type = file.split(';')[0].split('/')[1];
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: `${fileId}.${type}`,
            Body: buffer,
            ContentType: `image/${type}`
        };

        const command = new PutObjectCommand(params);
        const data = await client.send(command);
        return data;
    } catch (err) {
        console.error('Error uploading file:', err);
        return err;
    }
};

exports.getFile = async fileKey => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: fileKey
        };

        const command = new GetObjectCommand(params);
        const response = await client.send(command);
        const body = await response.Body.getReader().read();
        const fileData = Buffer.from(body.value).toString('base64');
        return fileData;
    } catch (err) {
        console.error('Error getting file:', err);
        return err;
    }
};

exports.deleteFile = async file => {
    try {
        const extractedUUID = extractUUIDFromURL(file);
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: extractedUUID
        };

        const command = new DeleteObjectCommand(params);
        await client.send(command);
    } catch (err) {
        console.error('Error deleting file:', err);
        return err;
    }
};

exports.checkS3Connection = async () => {
    try {
        const params = {
            Bucket: AWS_BUCKET_NAME
        };

        const command = new HeadBucketCommand(params);
        await client.send(command);
        console.log('✅ AWS S3: connection established successfully!');
    } catch (error) {
        console.error('❌ AWS S3 connection failed:', error);
    }
};

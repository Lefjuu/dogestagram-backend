const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    HeadBucketCommand
} = require('@aws-sdk/client-s3');
const { fromBase64 } = require('base64-arraybuffer');

const client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

exports.uploadFile = async (file, author) => {
    const buffer = fromBase64(file.replace(/^data:image\/\w+;base64,/, ''));
    const type = file.split(';')[0].split('/')[1];

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${author}.${type}`,
        Body: buffer,
        ContentType: `image/${type}`
    };

    const command = new PutObjectCommand(params);

    try {
        const data = await client.send(command);
        return data;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
};

exports.deleteFile = async file => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file
        };

        const command = new DeleteObjectCommand(params);
        await client.send(command);
    } catch (err) {
        console.error('Error deleting file:', err);
        throw err;
    }
};

exports.checkS3Connection = async () => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME
        };

        const command = new HeadBucketCommand(params);
        await client.send(command);
        console.log('✅ AWS S3: connection established successfully!');
    } catch (error) {
        console.error('❌ AWS S3 connection failed:', error);
    }
};

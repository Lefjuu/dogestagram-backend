const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey
});

exports.uploadFile = async (file, author) => {
    const base64Data = new Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
    );
    const type = file.split(';')[0].split('/')[1];
    const uploadParams = {
        Bucket: bucketName,
        Key: `${author}.${type}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    };

    return await s3.upload(uploadParams).promise();
};

exports.deleteFile = async file => {
    try {
        file = file.split('/').slice(-1)[0];
        const uploadParams = {
            Bucket: bucketName,
            Key: `${file}`
        };
        s3.deleteObject(uploadParams);
        return;
    } catch (err) {
        console.log(err);
    }
};

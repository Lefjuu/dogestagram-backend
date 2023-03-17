import pkg from 'aws-sdk'
const { S3 } = pkg
import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

export const uploadFile = async (file, author) => {
    const base64Data = new Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
    )
    const type = file.split(';')[0].split('/')[1]
    const uploadParams = {
        Bucket: bucketName,
        Key: `${author}.${type}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    }

    return await s3.upload(uploadParams).promise()
}

export const deleteFile = async (file) => {
    try {
        file = file.split('/').slice(-1)[0]
        const uploadParams = {
            Bucket: bucketName,
            Key: `${file}`
        }
        s3.deleteObject(uploadParams, function (err, data) {
            // if (err) console.log(err, err.stack)
            // else console.log(data)
        })
        return
    } catch (err) {
        console.log(err)
    }
}

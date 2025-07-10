const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

exports.uploadToS3Bucket = (s3FilePath, mimetype, buffer,size) => new Promise(async (resolve, reject) => {
  try {
    const client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      region: process.env.AWS_REGION || 'default',
      endpoint: process.env.S3_ENDPOINT,
      disableHostPrefix: true,
      disableS3ExpressSessionAuth: true,
      forcePathStyle: true,
      
    })

    s3FilePath = s3FilePath.replace(/^\//,'').replaceAll('///','/').replaceAll('//','/')

    const uploadCmd=new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET || '',
      Key:s3FilePath,
      Body:buffer,
      ContentType:mimetype,
      ContentLength:size,
      
    })

    const fileUrl=`${process.env.AWS_S3_PUBLIC_URI}/${s3FilePath}`
    await client.send(uploadCmd)
    resolve(fileUrl)
   
  } catch (err) {
    console.log('tryErr:', err)
    reject(err)
  }
})

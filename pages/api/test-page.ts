import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.S3_USER || !process.env.S3_KEY) {
    throw new Error('Add s3 credentials to .env')
  }

  const client = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_USER,
      secretAccessKey: process.env.S3_KEY,
    },
  })

  const MB = Math.pow(2, 20)
  const post = await createPresignedPost(client, {
    Bucket: 'x',
    Key: 'x.pdf',
    Conditions: [['content-length-range', 1, 15 * MB]],
    Fields: {
      'Content-Type': `application/pdf`,
    },
    Expires: 600,
  })

  res.status(200).json(post)
}

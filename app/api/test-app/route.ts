import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
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

  return NextResponse.json(post)
}

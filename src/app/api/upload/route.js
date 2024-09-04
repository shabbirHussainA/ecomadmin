import { NextResponse } from 'next/server';
import multiparty from 'multiparty';
import { mongooseConnect } from '@/lib/mongoose';
// import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

export async function POST(req) {
  await mongooseConnect();
  // await isAdminRequest(req, res);

  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const links = [];

    for (const file of files.file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'next-ecommerce',
      });
      links.push(result.secure_url);
    }

    return NextResponse.json({ links }, { status: 200 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

export const config = {
  api: { bodyParser: false },
};

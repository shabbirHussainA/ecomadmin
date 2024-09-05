import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Promisify the file system methods for easier async/await usage
const writeFile = promisify(fs.writeFile);
const unlinkFile = promisify(fs.unlink);
//configuring cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

// Function to convert Web ReadableStream to Node.js ReadableStream for easier file handling
function convertWebStreamToNodeStream(webStream) {
  const reader = webStream.getReader();  // Get reader from WebStream to read its content
  return new Readable({
    async read() {
      const { done, value } = await reader.read();  // Read chunks of data from the stream
      if (done) {
        this.push(null);  // When done, signal end of stream
      } else {
        this.push(value);  // Push data chunk into Node.js stream
      }
    },
  });
}

// Helper function to save a file to a local path before uploading it to Cloudinary
async function saveFileLocally(fileStream, filePath) {
  const writeStream = fs.createWriteStream(filePath);  // Create a writable stream to save file locally
  fileStream.pipe(writeStream);  // Pipe file data to the write stream
  
  // Return a promise that resolves when the writing finishes, or rejects if an error occurs
  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);  // When finished writing, resolve the promise
    writeStream.on('error', reject);  // If an error occurs, reject the promise
  });
}


export async function POST(req) {
  await dbConnect();  // Establish a database connection (not used in this specific code, but likely part of a larger app)

  try {
    const formData = await req.formData();  // Parse the incoming form data from the request
    const files = formData.getAll('file');  // Get all uploaded files

    if (!files.length) {  // Check if there are no files uploaded
      return NextResponse.json(
        { error: 'No files were uploaded' },  // Return an error response if no files
        { status: 400 }
      );
    }

    const links = await Promise.all(  // Use Promise.all to upload multiple files concurrently
      files.map(async (file) => {  // Iterate over each uploaded file
        const fileStream = convertWebStreamToNodeStream(file.stream());  // Convert WebStream to Node.js stream

        // Define the local file path where the file will be temporarily saved
        const localFilePath = path.join(process.cwd(), 'public', 'uploads', file.name);

        await saveFileLocally(fileStream, localFilePath);  // Save file locally

        // Upload the file to Cloudinary using the local file path
        const cloudinaryResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            localFilePath,  // Upload from the local file path
            { folder: 'next-ecommerce' },  // Upload to a specific Cloudinary folder
            (error, result) => {
              if (error) return reject(error);  // Handle upload errors
              resolve(result.secure_url);  // Resolve with Cloudinary URL on success
            }
          );
        });

        console.log('Cloudinary Upload Result:', cloudinaryResult);  // Debugging: log Cloudinary upload result

        await unlinkFile(localFilePath);  // Delete the local file after uploading to Cloudinary

        return cloudinaryResult;  // Return the Cloudinary URL for the uploaded image
      })
    );

    // Return JSON response containing the uploaded file URLs
    return NextResponse.json({ links }, { status: 200 });
  } catch (error) {
    console.error('Error uploading files:', error);  // Log errors to the console
    return NextResponse.json(
      { error: 'Failed to upload files' },  // Return error response on failure
      { status: 500 }
    );
  }
}

export const config = {
  api: { bodyParser: false },
};

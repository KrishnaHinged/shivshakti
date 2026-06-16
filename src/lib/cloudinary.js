import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a binary buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - Original filename
 * @param {string} folder - Destination folder in Cloudinary
 */
export async function uploadToCloudinary(fileBuffer, fileName, folder = "shivshakti") {
  return new Promise((resolve, reject) => {
    // Generate clean public ID
    const cleanName = fileName
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: `${cleanName}_${Date.now()}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete a file from Cloudinary using its public ID
 * @param {string} publicId - Cloudinary asset public ID
 * @param {string} resourceType - Resource type (image, video, raw)
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
}

export default cloudinary;

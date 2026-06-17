import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function saveLocally(fileBuffer, fileName) {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const cleanName = fileName
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
    const ext = path.extname(fileName) || ".jpg";
    const localFileName = `${cleanName}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, localFileName);
    
    await fs.writeFile(filePath, fileBuffer);
    
    return {
      secure_url: `/uploads/${localFileName}`,
      public_id: `local_mock_${cleanName}_${Date.now()}`,
    };
  } catch (err) {
    console.error("Local upload fallback error:", err);
    throw new Error("Local filesystem upload fallback failed: " + err.message);
  }
}

/**
 * Upload a binary buffer to Cloudinary (with local filesystem fallback for mock/failed environments)
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - Original filename
 * @param {string} folder - Destination folder in Cloudinary
 */
export async function uploadToCloudinary(fileBuffer, fileName, folder = "shivshakti") {
  // Local development fallback for mock credentials
  const isMock =
    !process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY === "mock_key" ||
    process.env.CLOUDINARY_CLOUD_NAME === "mock_cloud";

  if (isMock) {
    return saveLocally(fileBuffer, fileName);
  }

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
      async (error, result) => {
        if (error) {
          // If we are in local development, fall back to local disk saving rather than failing
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[Cloudinary Upload Failed] Error: ${error.message || JSON.stringify(error)}. Falling back to local storage.`
            );
            try {
              const localResult = await saveLocally(fileBuffer, fileName);
              resolve(localResult);
              return;
            } catch (fallbackErr) {
              return reject(fallbackErr);
            }
          }
          return reject(error);
        }
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
  // If publicId starts with local_mock_, handle locally (noop)
  if (publicId && publicId.startsWith("local_mock_")) {
    return { result: "ok" };
  }

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

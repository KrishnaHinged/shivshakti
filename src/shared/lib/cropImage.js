/**
 * Canvas-based image cropping utility
 * Used with react-easy-crop to produce a cropped Blob
 */

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

/**
 * Crop an image to the specified pixel area and return a Blob
 * @param {string} imageSrc - Source image URL or object URL
 * @param {Object} pixelCrop - { x, y, width, height } in pixels
 * @param {string} mimeType - Output MIME type (default: image/jpeg)
 * @returns {Promise<Blob>}
 */
export default async function getCroppedImg(imageSrc, pixelCrop, mimeType = "image/jpeg") {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas crop produced empty blob"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      0.92
    );
  });
}

/**
 * Utility to optimize, compress, and convert images to WebP format using HTML5 Canvas.
 * Generates both a high-quality responsive main image and a fast-loading thumbnail.
 */

export interface OptimizedImages {
  fileData: string; // Base64 Data URL for the main WebP image
  thumbData: string; // Base64 Data URL for the thumbnail WebP image
  width: number;
  height: number;
}

export function optimizeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<OptimizedImages> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate optimized dimensions for main image
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Create canvas for main optimized image
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Could not get 2D canvas context");
          }

          // Draw main image
          ctx.drawImage(img, 0, 0, width, height);

          // Export as WebP
          const fileData = canvas.toDataURL("image/webp", quality);

          // Create thumbnail canvas (e.g. max 240px width/height)
          const thumbSize = 240;
          let thumbW = img.width;
          let thumbH = img.height;

          if (thumbW > thumbSize || thumbH > thumbSize) {
            if (thumbW > thumbH) {
              thumbH = Math.round((thumbH * thumbSize) / thumbW);
              thumbW = thumbSize;
            } else {
              thumbW = Math.round((thumbW * thumbSize) / thumbH);
              thumbH = thumbSize;
            }
          }

          const thumbCanvas = document.createElement("canvas");
          thumbCanvas.width = thumbW;
          thumbCanvas.height = thumbH;
          const thumbCtx = thumbCanvas.getContext("2d");
          if (!thumbCtx) {
            throw new Error("Could not get 2D canvas context for thumbnail");
          }

          thumbCtx.drawImage(img, 0, 0, thumbW, thumbH);
          const thumbData = thumbCanvas.toDataURL("image/webp", 0.7);

          resolve({
            fileData,
            thumbData,
            width,
            height
          });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an SEO friendly file name based on original name or article title
 */
export function seoFriendlyFilename(originalName: string, title?: string): string {
  const extension = ".webp";
  let baseName = "";

  if (title) {
    baseName = title;
  } else {
    const lastDot = originalName.lastIndexOf(".");
    baseName = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
  }

  const clean = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return clean ? `${clean}${extension}` : `image-${Date.now()}${extension}`;
}

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// DigitalOcean Spaces configuration
const s3Client = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT || 'https://nyc3.digitaloceanspaces.com',
  region: process.env.NEXT_PUBLIC_S3_REGION || 'nyc3',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET || 'bulgaria-photos';

export async function uploadToSpaces(
  file: File,
  folder: string = 'photos'
): Promise<string> {
  const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
    ACL: 'public-read',
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);

    // Return public URL
    const endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT || 'https://nyc3.digitaloceanspaces.com';
    return `${endpoint}/${BUCKET_NAME}/${fileName}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}

// Create thumbnail (basic client-side resize)
export async function createThumbnail(
  file: File,
  maxWidth: number = 400
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = maxWidth / img.width;
        const newWidth = maxWidth;
        const newHeight = img.height * scaleFactor;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create thumbnail'));
              return;
            }

            const thumbnailFile = new File(
              [blob],
              `thumb-${file.name}`,
              { type: 'image/jpeg' }
            );
            resolve(thumbnailFile);
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

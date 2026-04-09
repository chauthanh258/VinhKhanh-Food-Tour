import { v2 as cloudinary } from 'cloudinary';

const parseCloudinaryUrl = (url?: string) => {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed.startsWith('cloudinary://')) return null;

  // Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
  const withoutScheme = trimmed.slice('cloudinary://'.length);
  const atIndex = withoutScheme.lastIndexOf('@');
  if (atIndex === -1) return null;

  const credentials = withoutScheme.slice(0, atIndex);
  const cloudName = withoutScheme.slice(atIndex + 1);
  const colonIndex = credentials.indexOf(':');
  if (colonIndex === -1) return null;

  const apiKey = credentials.slice(0, colonIndex);
  const apiSecret = credentials.slice(colonIndex + 1);
  if (!apiKey || !apiSecret || !cloudName) return null;

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  };
};

const cloudinaryUrlConfig = parseCloudinaryUrl(process.env.CLOUDINARY_URL);

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || cloudinaryUrlConfig?.cloud_name,
  api_key: process.env.CLOUDINARY_API_KEY || cloudinaryUrlConfig?.api_key,
  api_secret: process.env.CLOUDINARY_API_SECRET || cloudinaryUrlConfig?.api_secret,
};

if (cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret) {
  cloudinary.config(cloudinaryConfig);
}

const isCloudinaryConfigured = Boolean(
  cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret
);

type UploadResourceType = 'image' | 'video';

const uploadBuffer = (
  buffer: Buffer,
  options: {
    folder: string;
    resourceType: UploadResourceType;
    publicId: string;
  }
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: options.resourceType,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
          return;
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(buffer);
  });
};

export const uploadImageBuffer = async (buffer: Buffer, publicId: string, folder = 'poi-media/images') => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured');
  }

  return uploadBuffer(buffer, {
    folder,
    resourceType: 'image',
    publicId,
  });
};

export const uploadAudioBuffer = async (buffer: Buffer, publicId: string, folder = 'poi-media/audio') => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured');
  }

  return uploadBuffer(buffer, {
    folder,
    resourceType: 'video',
    publicId,
  });
};

export const destroyCloudinaryAsset = async (publicId: string, resourceType: UploadResourceType) => {
  if (!isCloudinaryConfigured) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.warn('Failed to delete Cloudinary asset:', publicId, error);
  }
};
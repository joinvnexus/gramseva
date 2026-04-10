// Cloudinary ইমেজ আপলোড ইউটিলিটি

interface UploadOptions {
  folder?: string;
  transformation?: Record<string, any>;
}

export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const { folder = 'gramseva', transformation = {} } = options;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'gramseva_preset'); // Cloudinary থেকে preset তৈরি করুন
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    throw new Error('Upload failed');
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export function getImageUrl(publicId: string, options: Record<string, any> = {}): string {
  const transformations = Object.entries(options)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}
// src/lib/audioUpload.ts

export async function uploadAudio(file: File | Blob): Promise<string> {
  const formData = new FormData();
  const fileToUse = file instanceof Blob ? new File([file], 'audio.webm', { type: file.type }) : file;
  formData.append('file', fileToUse);
  formData.append('upload_preset', 'gramseva_preset');
  formData.append('folder', 'gramseva/audio');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    throw new Error('Audio upload failed');
  } catch (error) {
    console.error('Audio upload error:', error);
    throw error;
  }
}
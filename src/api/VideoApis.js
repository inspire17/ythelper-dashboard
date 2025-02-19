import { CONSTANTS } from '../constants/Constants';

export const fetchVideos = async channelId => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/media/videos?channelId=${channelId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem(CONSTANTS.TOKEN_KEY)}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch videos. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected API response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return []; // Return empty array on failure to prevent undefined errors
  }
};

export const uploadVideo = async videoData => {
  const response = await fetch(
    'http://localhost:8080/api/media/video/raw_upload',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(CONSTANTS.TOKEN_KEY)}`,
      },
      body: videoData,
    }
  );

  return response.json();
};

export const uploadTextInstruction = async instructionData => {
  const response = await fetch(
    'http://localhost:8080/api/media/video/text_instruction',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(CONSTANTS.TOKEN_KEY)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(instructionData)),
    }
  );

  return response.json();
};

export const uploadAudioInstruction = async instructionData => {
  const response = await fetch(
    'http://localhost:8080/api/media/video/audio_instruction',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(CONSTANTS.TOKEN_KEY)}`,
      },
      body: instructionData, // Must be FormData
    }
  );

  return response.json();
};

export const uploadVideoMetadata = async metadata => {
  const response = await fetch(
    'http://localhost:8080/api/media/video/metadata',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem(CONSTANTS.TOKEN_KEY)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    }
  );

  return response.json();
};

export const fetchVideoStream = async videoId => {
  try {
    const token = localStorage.getItem(CONSTANTS.TOKEN_KEY);
    if (!token) throw new Error('Authorization token is missing.');

    const response = await fetch(
      `http://localhost:8080/api/media/video/view?id=${videoId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 403) throw new Error('Access Denied.');
    if (!response.ok)
      throw new Error(`Failed to fetch video. Status: ${response.status}`);

    // Convert response to a blob and create a URL
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
  } catch (error) {
    console.error('Error fetching video stream:', error);
    return null;
  }
};

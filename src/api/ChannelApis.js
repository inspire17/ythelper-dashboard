import { CONSTANTS } from '../constants/Constants';

export const fetchChannels = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/channel/channels', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(CONSTANTS.TOKEN_KEY)}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw new Error('Unauthorized access. Please login again.');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch channels');
    }

    const data = await response.json();

    return data.map(channel => ({
      value: channel.id, // Use channel id as the value
      label: channel.name, // Use channel name as label
    }));
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

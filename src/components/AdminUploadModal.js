import React, { useState, useEffect } from 'react';
import '../styles/VideoUploadModal.css';
import { uploadVideo } from '../api/VideoApis';
import { fetchChannels } from '../api/ChannelApis';
import Select from 'react-select';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure this is imported
import { TOAST_CONFIG } from '../constants/Constants';

const VideoUploadModal = ({ isOpen, onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isValidVideo, setIsValidVideo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchChannels()
        .then(data => setChannels(data))
        .catch(error => console.error('Failed to fetch channels:', error));
    }
  }, [isOpen]);

  const handleVideoChange = event => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setIsValidVideo(true);
    } else {
      setVideoFile(null);
      setIsValidVideo(false);
      toast.warning('Please upload a valid video file!', TOAST_CONFIG);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !title || !selectedChannel) {
      toast.warning('All fields must be filled!', TOAST_CONFIG);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('title', title);
      formData.append('channelId', selectedChannel.value);

      const resp = await uploadVideo(formData);

      if (resp.status === 200) {
        toast.success('Video uploaded successfully!', TOAST_CONFIG);

        setTimeout(() => {
          resetForm();
          onClose();
        }, 1500);
      } else {
        throw new Error(resp.message);
      }
    } catch (error) {
      toast.error('Video upload failed!', TOAST_CONFIG);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setVideoFile(null);
    setSelectedChannel(null);
    setIsValidVideo(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <ToastContainer /> {/* Ensure it’s inside */}
      <div className="modal-content">
        <button
          className="close-button"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          X
        </button>
        <h2>Upload Video</h2>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>
        <div className="form-group">
          <label>Channel</label>
          <Select
            options={channels}
            value={selectedChannel}
            onChange={setSelectedChannel}
            placeholder="Select a channel"
          />
        </div>
        <div className="form-group">
          <label>Video File</label>
          <input type="file" accept="video/*" onChange={handleVideoChange} />
        </div>
        <div className="upload-container">
          <button
            className="upload-icon-button"
            onClick={handleUpload}
            disabled={uploading || !isValidVideo || !title || !selectedChannel}
          >
            {uploading ? <FaSpinner className="spinner" /> : <FaUpload />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;

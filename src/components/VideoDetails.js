import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVideoStream } from '../api/VideoApis';
import '../styles/VideoDetails.css';

const videoCache = {}; // ✅ Cache for video URLs

const VideoDetails = () => {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState(videoCache[id] || null);
  const [loading, setLoading] = useState(!videoCache[id]);
  const [isVertical, setIsVertical] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const getVideoStream = async () => {
      if (videoCache[id]) {
        setVideoUrl(videoCache[id]);
        setLoading(false);
      } else {
        try {
          const url = await fetchVideoStream(id);
          videoCache[id] = url;
          setVideoUrl(url);
        } catch (error) {
          console.error('Error fetching video stream:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getVideoStream();
  }, [id]);

  // Check if the video is vertical after it loads
  const handleVideoMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setIsVertical(videoHeight > videoWidth); // Detect if it's vertical
    }
  };

  // Mock Data for Video Metadata (Title, Description, etc.)
  const mockVideoData = {
    title: 'Mock Video Title',
    description: 'This is a sample video description.',
    channelName: 'Mock Channel',
    instructions: [
      {
        text: 'Text instruction 1',
        audioUrl:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
      { text: 'Text instruction 2', audioUrl: '' }, // No audio for this one
    ],
    comments: [
      { text: 'Great video!', time: '12:30 PM', audioUrl: '' },
      {
        text: 'Please add subtitles.',
        time: '1:15 PM',
        audioUrl:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
    ],
  };

  return (
    <div className="video-details-container">
      {/* Video Player */}
      <div className="video-player">
        {loading ? (
          <p>Loading video...</p>
        ) : videoUrl ? (
          <video
            ref={videoRef}
            controls
            className={isVertical ? 'vertical-video' : 'horizontal-video'}
            onLoadedMetadata={handleVideoMetadata}
            controlsList="nodownload"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>Failed to load video</p>
        )}
      </div>

      {/* Video Information */}
      <div className="video-info">
        <label>Title</label>
        <input type="text" value="Mock Video Title" readOnly />

        <label>Description</label>
        <textarea
          className="desciption_textarea"
          type="text"
          value="This is a sample video description."
          readOnly
        />

        <label>Channel</label>
        <input type="text" value="Mock Channel" readOnly />
      </div>
      {/* Instructions Section */}
      <div className="instructions-section">
        <h3>Instruction</h3>
        {mockVideoData.instructions.map((instruction, index) => (
          <div key={index} className="instruction-item">
            <span>{instruction.text}</span>
            {instruction.audioUrl && (
              <button onClick={() => new Audio(instruction.audioUrl).play()}>
                ▶ Play Audio
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {mockVideoData.comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <span>
              {comment.text} - {comment.time}
            </span>
            {comment.audioUrl && (
              <button onClick={() => new Audio(comment.audioUrl).play()}>
                ▶ Play Audio Comment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetails;

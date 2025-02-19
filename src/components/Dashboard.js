import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VideoUploadModal from '../components/AdminUploadModal';
import Select from 'react-select';
import '../styles/Dashboard.css';
import {
  FaSearch,
  FaFilter,
  FaBars,
  FaPlus,
  FaTimes,
  FaSync,
  FaCog,
  FaSun,
  FaMoon,
} from 'react-icons/fa';
import { fetchChannels } from '../api/ChannelApis';
import { fetchVideos, fetchVideoStream } from '../api/VideoApis';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { TOAST_CONFIG } from '../constants/Constants';

const fetchVideosByChannel = async channelId => {
  var data = await fetchVideos(channelId);
  return data;
};

const fetchUserPrivilage = async () => {
  return { isAdmin: true };
};

const Dashboard = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [collapsedColumns, setCollapsedColumns] = useState({});
  const [theme, setTheme] = useState('light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoCache, setVideoCache] = useState({}); // Cache video URLs to avoid re-fetching
  const [refreshVideos, setRefreshVideos] = useState(false);

  const toggleTheme = mode => {
    setTheme(mode);
  };

  useEffect(() => {
    if (selectedChannel) {
      setLoading(true);
      fetchVideosByChannel(selectedChannel.value).then(videos => {
        setVideos(videos);
        const uniqueAssignees = [
          ...new Set(videos.map(video => video.assignee)),
        ].map(a => ({ value: a, label: a }));
        setAssignees(uniqueAssignees);
        setLoading(false);
      });
    }
  }, [selectedChannel, refreshVideos]);

  useEffect(() => {
    const fetchData = async () => {
      if (!state.isAuthenticated) {
        navigate('/login');
      } else {
        try {
          const user = await fetchUserPrivilage();
          setUser(user);

          const channels = await fetchChannels();
          if (channels.length > 0) {
            setChannels(channels);
            setSelectedChannel(channels[0]); // Default selection
          } else {
            setChannels([]);
            setSelectedChannel(null);
          }
        } catch (error) {
          if (error.message === 'Unauthorized access. Please login again.') {
            toast.error(
              'Unauthorized access. Please login again.',
              TOAST_CONFIG
            );
            navigate('/login');
          } else {
            console.error('Error fetching channels:', error);
            setChannels([]);
            setSelectedChannel(null);
          }
        }
      }
    };

    fetchData();
  }, [state.isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedChannel) {
      setLoading(true);
      fetchVideosByChannel(selectedChannel.value).then(videos => {
        setVideos(videos);
        const uniqueAssignees = [
          ...new Set(videos.map(video => video.assignee)),
        ].map(a => ({ value: a, label: a }));
        setAssignees(uniqueAssignees);
        setLoading(false);
      });
    }
  }, [selectedChannel]);

  if (!state.isAuthenticated) {
    return <p>Access Denied. Please login.</p>;
  }

  const statuses = [
    'TODO',
    'IN PROGRESS',
    'IN REVIEW',
    'APPROVED',
    'PUBLISHED',
  ];

  const clearFilters = () => {
    setSelectedChannel(null);
    setSelectedAssignee(null);
    setFilterOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredVideos = videos.filter(video => {
    return (
      (!selectedAssignee || video.assignee === selectedAssignee?.value) &&
      (searchQuery === '' ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.assignee?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const openVideoModal = async video => {
    if (videoCache[video.id]) {
      // If video is already cached, use it
      setSelectedVideoUrl(videoCache[video.id]);
      setIsVideoModalOpen(true);
    } else {
      setLoadingVideo(true);
      try {
        const videoUrl = await fetchVideoStream(video.id);
        setVideoCache(prevCache => ({ ...prevCache, [video.id]: videoUrl })); // Cache the URL
        setSelectedVideoUrl(videoUrl);
      } catch (error) {
        console.error('Failed to fetch video:', error);
      } finally {
        setLoadingVideo(false);
        setIsVideoModalOpen(true);
      }
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setTimeout(() => {
      setSelectedVideoUrl(null); // Ensure cleanup after closing
    }, 300); // Small delay to avoid flickering
  };

  const handleVideoClick = video => {
    navigate(`/video/${video.id}`);
  };

  return (
    <div>
      <div className="dashboard-container">
        <div className="top-bar">
          <button
            className="filter-toggle"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FaBars />
          </button>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title or assignee"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            {searchQuery && (
              <button className="clear-search" onClick={clearSearch}>
                <FaTimes />
              </button>
            )}
          </div>
          <button
            className="upload-button"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
          </button>
        </div>

        {filterOpen && (
          <div className="filter-window">
            <div className="filter-header">
              <span className="filter-title">Filter Videos</span>
              <div className="filter-controls">
                <button className="filter-refresh" onClick={clearFilters}>
                  <FaSync />
                </button>
                <button
                  className="filter-close"
                  onClick={() => setFilterOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <label>Channel</label>
            <Select
              options={channels}
              value={selectedChannel}
              onChange={setSelectedChannel}
              className="channel-select"
            />
            <label>Assignee</label>
            <Select
              options={assignees}
              value={selectedAssignee}
              onChange={setSelectedAssignee}
              isClearable
              placeholder="Filter by Assignee"
              className="assignee-filter"
            />
          </div>
        )}

        <VideoUploadModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setRefreshVideos(prev => !prev);
          }}
        />

        {loading ? (
          <p>Loading videos...</p>
        ) : (
          <div className="kanban-board">
            {statuses.map(status => (
              <div
                key={status}
                className={`kanban-column ${collapsedColumns[status] ? 'collapsed' : ''}`}
              >
                <h3
                  className="kanban-header"
                  onClick={() =>
                    setCollapsedColumns(prev => ({
                      ...prev,
                      [status]: !prev[status],
                    }))
                  }
                >
                  {status}
                </h3>

                {!collapsedColumns[status] &&
                  filteredVideos
                    .filter(video => video.status === status)
                    .map(video => (
                      <div key={video.id} className="video-list-item">
                        <div
                          key={video.id}
                          className="video-list-item"
                          onClick={() => openVideoModal(video)}
                        >
                          <img
                            className="video-thumbnail"
                            src={video.thumbnail}
                            alt="Video Thumbnail"
                          />
                        </div>
                        <p
                          className="video-title"
                          title={video.title}
                          onClick={() => handleVideoClick(video)}
                        >
                          {video.title}{' '}
                        </p>
                        {/* <p className={`status-tag ${video.status.toLowerCase().replace(" ", "-")}`}></p> */}
                      </div>
                    ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {/* Settings Icon */}
        <button
          className="settings-icon"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <FaCog />
        </button>

        {/* Settings Menu */}
        {isSettingsOpen && (
          <div className="settings-menu">
            <p>Account Settings</p>
            {user?.isAdmin && <p>Admin Settings</p>}
            {/* enhancement
             */}
            {/* <div className="theme-toggle">
            <button onClick={() => toggleTheme("light")}>
              <FaSun /> Daylight
            </button>
            <button onClick={() => toggleTheme("dark")}>
              <FaMoon /> Night Mode
            </button>
          </div> */}
            <p
              className="logout"
              onClick={() => dispatch({ type: 'LOGOUT' }) && navigate('/login')}
            >
              Logout
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isVideoModalOpen}
        onRequestClose={closeVideoModal}
        className="video-modal"
        overlayClassName="video-modal-overlay"
      >
        <div className="video-modal-content">
          <div>
            <button className="modal-close-button" onClick={closeVideoModal}>
              &#10005;
            </button>
          </div>
          <div className="model-video-player">
            {loadingVideo ? (
              <p>Loading...</p>
            ) : (
              selectedVideoUrl && (
                <video
                  controls
                  autoPlay
                  className="video-player"
                  controlsList="nodownload"
                >
                  <source src={selectedVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;

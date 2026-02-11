import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import HLSService from '../../services/hls.service';
import { fetchVideoById, resetPlayer } from '../store/playerSlice'; 

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  
  const { currentVideo, loading, error } = useSelector((state) => state.player);

  // 1. Fetch Video Data
  useEffect(() => {
    if (id) {
      dispatch(fetchVideoById(id));
    }
    return () => {
      dispatch(resetPlayer());
    };
  }, [id, dispatch]);

  // 2. Initialize HLS Player
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && currentVideo?.videoUrl) {
      const hls = HLSService.loadVideo(videoElement, currentVideo.videoUrl);
      return () => {
        if (hls) hls.destroy();
      };
    }
  }, [currentVideo]);

  if (loading) return <div className="text-white text-center h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="w-screen h-screen bg-black relative group">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-20 text-white bg-black/50 px-4 py-2 rounded hover:bg-white/20 transition"
      >
        ← Back
      </button>

      <video
        ref={videoRef}
        controls
        autoPlay
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Watch;
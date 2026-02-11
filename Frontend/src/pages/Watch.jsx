import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

import { Settings, Check, ArrowLeft, Film, Maximize, Minimize } from 'lucide-react';

import HLSService from '../../services/hls.service';
import { fetchVideoById, resetPlayer } from './../store/playerSlice';
import { logoutUser } from './../store/authSlice';
import Navbar from './../components/Navbar';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null); 

  // State
  const [hlsInstance, setHlsInstance] = useState(null);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); 

  // Redux & Navbar State
  const { currentVideo, loading, error } = useSelector((state) => state.player);
  const { user, token } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for fullscreen changes (ESC key support)
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

const handleLogout = async () => {
  await dispatch(logoutUser());
  navigate('/login');
};

// 🟢 Update this useEffect in Watch.jsx
useEffect(() => {
  // Only fetch if we have an ID AND we have confirmed the user is logged in
  if (id && user) {
    dispatch(fetchVideoById(id));
  } else if (id && !user) {
    // If there is no user, try to check auth first
    dispatch(checkAuth());
  }
  
  return () => dispatch(resetPlayer());
}, [id, dispatch, user]); // Added 'user' to dependency array

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && currentVideo?.videoUrl) {
      const hls = HLSService.loadVideo(videoElement, currentVideo.videoUrl, console.error);
      if (hls) {
        setHlsInstance(hls);
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          const levels = data.levels.map((level, index) => ({
            index: index,
            height: level.height,
            label: `${level.height}p`,
          }));
          setQualities(levels.reverse());
        });
      }
      return () => { if (hls) hls.destroy(); };
    }
  }, [currentVideo]);

  const changeQuality = (levelIndex) => {
    if (!hlsInstance) return;
    hlsInstance.currentLevel = levelIndex;
    setCurrentQuality(levelIndex);
    setShowQualityMenu(false);
  };

  // 4. Custom Fullscreen Toggle Function
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const userInitial = user?.username?.charAt(0).toUpperCase() || "U";

  if (loading) return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4"><Film className="w-12 h-12 text-purple-500 animate-pulse" /><p className="text-purple-200/50 text-sm animate-pulse">Loading Video...</p></div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-red-400">Unable to load video</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">
      
      {/* Hide Navbar when in Fullscreen Mode */}
      {!isFullScreen && (
        <Navbar 
          scrolled={scrolled} user={user} token={token} 
          showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} 
          handleLogout={handleLogout} navigate={navigate} 
          userInitial={userInitial} searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        />
      )}

      {/* Background Effect */}
      {currentVideo?.thumbnailUrl && !isFullScreen && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-30 blur-3xl scale-125" style={{ backgroundImage: `url(${currentVideo.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/95 to-slate-950" />
        </div>
      )}

      <main className={`relative z-10 ${isFullScreen ? 'w-full h-screen p-0' : 'container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28'}`}>
        
        {!isFullScreen && (
          <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-purple-600 transition-colors"><ArrowLeft className="w-5 h-5" /></div>
            <span className="text-sm font-medium">Back to Browse</span>
          </button>
        )}

        <div className={isFullScreen ? "w-full h-full" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}>
          <div className={isFullScreen ? "w-full h-full" : "lg:col-span-3"}>
            
            {/* 5. PLAYER CONTAINER (Ref attached here) */}
            <div 
              ref={playerContainerRef}
              className={`relative group bg-black overflow-hidden shadow-2xl ${isFullScreen ? 'w-full h-full flex items-center justify-center' : 'rounded-2xl border border-white/10'}`}
            >
              
              <video
                ref={videoRef}
                controls 
                autoPlay
                className={`bg-black ${isFullScreen ? 'w-full h-full' : 'w-full aspect-video'}`}
                playsInline
              />

              {/* 6. Custom Controls Overlay (Top Right) */}
              <div className="absolute top-4 right-4 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                
                {/* Quality Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg text-white hover:bg-purple-600 hover:border-purple-500 transition-all shadow-lg"
                  >
                    <Settings className={`w-5 h-5 ${showQualityMenu ? 'rotate-90' : ''} transition-transform duration-300`} />
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                      {currentQuality === -1 ? 'Auto' : `${qualities.find(q => q.index === currentQuality)?.height}p`}
                    </span>
                  </button>

                  {/* Quality Menu Dropdown */}
                  {showQualityMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 mb-1">Select Quality</div>
                        <button onClick={() => changeQuality(-1)} className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 flex items-center justify-between transition-colors">
                          <span className={currentQuality === -1 ? "text-purple-400 font-bold" : "text-slate-300"}>Auto</span>
                          {currentQuality === -1 && <Check className="w-4 h-4 text-purple-400" />}
                        </button>
                        {qualities.map((q) => (
                          <button key={q.index} onClick={() => changeQuality(q.index)} className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 flex items-center justify-between transition-colors">
                            <span className={currentQuality === q.index ? "text-purple-400 font-bold" : "text-slate-300"}>{q.label}</span>
                            {currentQuality === q.index && <Check className="w-4 h-4 text-purple-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. New Fullscreen Toggle Button */}
                <button
                  onClick={toggleFullScreen}
                  className="flex items-center justify-center w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/20 transition-all shadow-lg"
                  title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>

              </div>
              
              {/* Optional: Add CSS to hide the NATIVE fullscreen button to avoid confusion */}
              <style>{`
                video::-webkit-media-controls-fullscreen-button {
                  display: none !important;
                }
              `}</style>

            </div>

            {/* Video Meta Data (Hide in Fullscreen) */}
            {!isFullScreen && (
              <div className="mt-6 space-y-4">
                <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{currentVideo?.title}</h1>
                {currentVideo?.Tags && (
                  <div className="flex flex-wrap gap-2">
                    {currentVideo.Tags.map(tag => (
                      <span key={tag.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">#{tag.name}</span>
                    ))}
                  </div>
                )}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">{currentVideo?.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

import HLSService from '../../services/hls.service';
import { fetchVideoById, resetPlayer } from '../store/playerSlice';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const [hlsInstance, setHlsInstance] = useState(null);
  const [qualities, setQualities] = useState([]);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const { currentVideo, loading, error } = useSelector((state) => state.player);

  useEffect(() => {
    if (id) dispatch(fetchVideoById(id));
    return () => dispatch(resetPlayer());
  }, [id, dispatch]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && currentVideo?.videoUrl) {
      const hls = HLSService.loadVideo(videoElement, currentVideo.videoUrl, console.error);
      if (hls) {
        setHlsInstance(hls);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const levels = hls.levels.map((level, i) => ({
            index: i,
            label: `${level.height}p`,
          }));
          setQualities(levels);
        });
      }

      return () => { if (hls) hls.destroy(); };
    }
  }, [currentVideo]);

  const changeQuality = (levelIndex) => {
    if (!hlsInstance) return;
    hlsInstance.currentLevel = levelIndex;
    setShowQualityMenu(false);
  };

  if (loading) {
    return <div className="text-white text-center h-screen flex items-center justify-center">Loading video...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center h-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative">
      
      {currentVideo?.thumbnailUrl && (
        <>
          <div
            className="fixed inset-0 opacity-20 blur-3xl scale-150"
            style={{
              backgroundImage: `url(${currentVideo.thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="fixed inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
        </>
      )}

      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-lg border border-white/10"
      >
        ← Back
      </button>

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 bg-black">
              <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
                playsInline
              />

              {/* Quality Selector */}
              <div className="absolute bottom-4 right-4 z-20">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg text-sm hover:bg-black/80"
                >
                  ⚙ Quality
                </button>

                {showQualityMenu && (
                  <div className="mt-2 bg-slate-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                    <button
                      onClick={() => changeQuality(-1)}
                      className="block px-4 py-2 text-sm hover:bg-white/10 w-full text-left"
                    >
                      Auto
                    </button>
                    {qualities.map(q => (
                      <button
                        key={q.index}
                        onClick={() => changeQuality(q.index)}
                        className="block px-4 py-2 text-sm hover:bg-white/10 w-full text-left"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h1 className="text-4xl font-bold">{currentVideo?.title}</h1>
            <p className="text-slate-300">{currentVideo?.description}</p>

            {currentVideo?.Tags && (
              <div className="flex flex-wrap gap-2">
                {currentVideo.Tags.map(tag => (
                  <span key={tag.id} className="px-4 py-2 bg-slate-800 rounded-lg text-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Watch;

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../../store/contentSlice';
import { logout, logoutUser, checkAuth } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import VideoGrid from "../../components/VideoGrid";
import { Film, TrendingUp } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const genres = ["All", "Action", "Sci-Fi", "Drama", "Horror", "Comedy"];

  const { user, token } = useSelector((state) => state.auth); 
  const { videos, loading, error } = useSelector((state) => state.content);

  const isAuthenticated = !!user;

  useEffect(() => {
    if (!user) {
      dispatch(checkAuth());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (videos.length === 0) {
      dispatch(fetchVideos());
    }
  }, [dispatch, videos.length]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 
const filteredVideos = useMemo(() => {
  return videos.filter((video) => {
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      video.title.toLowerCase().includes(searchLower) ||
      video.Tags?.some(tag =>
        tag.name.toLowerCase().includes(searchLower)
      );

    const matchesGenre =
      selectedGenre === "All" ||
      video.Tags?.some(tag => tag.name === selectedGenre);

    return matchesSearch && matchesGenre;
  });
}, [videos, searchQuery, selectedGenre]);


  const handlePlayClick = (videoId) => {
    if (isAuthenticated) {
      navigate(`/watch/${videoId}`);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Film className="w-16 h-16 text-purple-500 animate-pulse mx-auto" strokeWidth={2} />
          <p className="text-purple-200 text-lg font-medium">Loading your content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-red-400 text-6xl">⚠️</div>
          <p className="text-red-300 text-lg">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all duration-300">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featuredVideo = videos[0];
  const userInitial = user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-black min-h-screen text-white">
      
      <Navbar 
        scrolled={scrolled}
        user={user}
        token={token}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        handleLogout={handleLogout}
        navigate={navigate}
        userInitial={userInitial}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <HeroSection 
        featuredVideo={featuredVideo}
        handlePlayClick={handlePlayClick}
        isAuthenticated={isAuthenticated}
      />

      <div className="relative px-4 sm:px-6 md:px-10 pb-16 pt-8 z-20">
        
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 border flex-shrink-0 ${
                selectedGenre === genre 
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-white/5 border-white/20 text-slate-400 hover:border-purple-500/50 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {selectedGenre !== "All" ? `${selectedGenre} Movies` : "Trending Now"}
          </h2>
        </div>
        
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No videos found matching your search.</p>
          </div>
        ) : (
          <VideoGrid 
            filteredVideos={filteredVideos}
            handlePlayClick={handlePlayClick}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>

      <footer className="relative px-6 md:px-10 py-12 border-t border-white/10 mt-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Film className="w-8 h-8 text-purple-500" strokeWidth={2.5} />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              MyFlix
            </h2>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 MyFlix Media. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;

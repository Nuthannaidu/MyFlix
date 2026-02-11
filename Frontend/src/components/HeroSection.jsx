import { Play } from 'lucide-react';

const HeroSection = ({
  featuredVideo,
  handlePlayClick,
  isAuthenticated
}) => {
  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={featuredVideo?.thumbnailUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80'} 
          alt="Featured" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-6 md:px-10 pb-10 md:pb-16 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
            {featuredVideo?.title || "Unlimited Entertainment"}
          </span>
        </h1>
        
        <p className="text-slate-300 text-sm md:text-base mb-6 md:mb-8 max-w-2xl line-clamp-3">
          {featuredVideo?.description || "Watch unlimited movies and shows. Stream anywhere, anytime."}
        </p>

        <div className="flex flex-wrap gap-3 md:gap-4">
          <button 
            onClick={() => featuredVideo && handlePlayClick(featuredVideo.id)}
            className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 bg-white text-black rounded-xl font-bold text-base md:text-lg hover:bg-white/90 transition-all duration-300 shadow-2xl shadow-black/50 group"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            <span>{isAuthenticated ? "Play Now" : "Sign In to Watch"}</span>
          </button>
          
          <button 
            onClick={() => featuredVideo && handlePlayClick(featuredVideo.id)}
            className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-base md:text-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
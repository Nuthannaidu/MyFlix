import { Play, Star } from 'lucide-react';

const VideoGrid = ({ filteredVideos, handlePlayClick, isAuthenticated }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
      {filteredVideos.map((video, index) => (
        <div 
          key={video.id} 
          onClick={() => handlePlayClick(video.id)}
          className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          {/* Video Card */}
          <div className="relative aspect-[2/3] bg-slate-800 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/30 group-hover:border-purple-500/50 transition-all duration-300">
            {/* Thumbnail */}
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            
            {/* Premium Badge for Non-Authenticated Users */}
            {!isAuthenticated && (
              <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-black/60 backdrop-blur-sm p-1 md:p-1.5 rounded-lg border border-yellow-500/30">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 md:p-4">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-3 h-3 md:w-4 md:h-4 text-black fill-current ml-0.5" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold bg-purple-600 px-2 py-1 rounded uppercase tracking-wide">
                    {isAuthenticated ? 'Play' : 'Sign In'}
                  </span>
                </div>
                <h3 className="font-bold text-[10px] md:text-xs line-clamp-2 text-white">
                  {video.title}
                </h3>
                {video.genre && (
                  <p className="text-[9px] md:text-[10px] text-slate-400 mt-1">
                    {video.genre}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Title Below Card */}
          <p className="mt-2 md:mt-3 text-[10px] md:text-xs font-semibold text-slate-400 group-hover:text-white transition-colors truncate px-1">
            {video.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
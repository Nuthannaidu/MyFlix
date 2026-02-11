import { Film, Search, LogOut } from 'lucide-react';

const Navbar = ({
  scrolled,
  user,
  token,
  showUserMenu,
  setShowUserMenu,
  handleLogout,
  navigate,
  userInitial,
  searchQuery,
  setSearchQuery
}) => {

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    
   
    if (e.target.value.length > 0) {
     
      window.scrollTo({
        top: window.innerHeight * 0.8,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-purple-900/20' 
        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
    }`}>
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4">
        <div className="flex items-center gap-4 md:gap-8">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <Film className="w-7 h-7 md:w-10 md:h-10 text-purple-500 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
               <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                MyFlix
              </h1>
            </div>
          </div>

          {/* Search Bar - Desktop */}

          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-purple-500/50 transition-all duration-300 focus-within:w-72 focus-within:bg-white/10">
            <Search className="w-4 h-4 text-purple-400" />
            <input 
              type="text"
              placeholder="Search movies..."
              value={searchQuery} 
              onChange={handleSearch} 
              className="bg-transparent border-none outline-none text-sm ml-2 w-64 placeholder:text-slate-500 text-white"
            />
          </div>
        </div>

        {/* Auth Section */}
        {user || token ? (
          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden sm:block text-white text-xs md:text-sm font-medium bg-white/10 px-3 md:px-4 py-2 rounded-lg border border-white/20">
              Hi, <span className="text-purple-300 font-semibold">{user?.username || 'User'}</span>
            </span>
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-2 border-purple-500/50 hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30"
              >
                <span className="text-white font-bold text-sm md:text-base">{userInitial}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-semibold transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-2 md:gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* Mobile Search Bar */}
 
      <div className="lg:hidden px-4 sm:px-6 pb-4">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-purple-500/50 transition-all duration-300 focus-within:bg-white/10">
          <Search className="w-4 h-4 text-purple-400" />
          <input 
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearch}
            className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder:text-slate-500 text-white"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
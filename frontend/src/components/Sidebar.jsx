const Sidebar = ({ userData, setShowProfile, handleLogout, exportToCSV, copyPublicLink }) => {
  return (
    <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-blue-600">SaaS Dash 🚀</h1>
        </div>
        
        <div 
          onClick={() => setShowProfile(true)}
          className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition group"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-gray-800 truncate">{userData.name || 'Loading...'}</p>
            <p className="text-xs text-gray-500 truncate">{userData.email || '...'}</p>
          </div>
          <div className="text-gray-400 font-bold">⚙️</div>
        </div>

        <div className="p-4 space-y-3">
          <button className="w-full flex items-center gap-3 bg-blue-50 text-blue-600 font-bold px-4 py-3 rounded-lg">
            <span className="text-lg">📊</span> Overview
          </button>
          <button onClick={copyPublicLink} className="w-full flex items-center gap-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-semibold px-4 py-3 rounded-lg transition">
            <span className="text-lg">🔗</span> Public Link
          </button>
          <button onClick={exportToCSV} className="w-full flex items-center gap-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-semibold px-4 py-3 rounded-lg transition">
            <span className="text-lg">📥</span> Export CSV
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 px-4 rounded-lg hover:bg-red-100 transition">
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
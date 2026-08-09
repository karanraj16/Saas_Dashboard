const ProfileModal = ({ userData, setShowProfile, handleLogout, totalClients, totalRevenue }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl relative animate-fade-in-up">
        
        <button 
          onClick={() => setShowProfile(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-extrabold text-xl transition"
        >
          ✕
        </button>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg mb-4 border-4 border-white">
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
          <p className="text-gray-500 mb-6 font-medium">{userData.email}</p>
          
          <div className="w-full bg-blue-50 rounded-xl p-5 mb-6 border border-blue-100 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-bold text-sm uppercase tracking-wide">Plan</span>
              <span className="bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">PRO 🚀</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600 font-bold text-sm uppercase tracking-wide">Clients</span>
              <span className="font-extrabold text-gray-800 text-lg">{totalClients}</span>
            </div>
            <div className="flex justify-between items-center border-t border-blue-200 pt-3 mt-1">
              <span className="text-gray-600 font-bold text-sm uppercase tracking-wide">Revenue</span>
              <span className="font-extrabold text-green-600 text-xl">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            <button 
              onClick={() => { alert("Edit Profile Coming Soon!"); setShowProfile(false); }} 
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Edit Profile
            </button>
            <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-lg hover:bg-red-100 transition border border-red-100">
              Sign Out Securely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
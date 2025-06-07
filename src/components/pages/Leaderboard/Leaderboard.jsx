import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Gift, X, ArrowLeft, Menu, ChevronRight, Wrench, Phone } from 'lucide-react';

// Leaderboard Challenge Modal Component
const LeaderboardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Modal Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Leaderboard Challenge</h2>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Join our weekly leaderboard challenge and win exciting prizes! Climb the leaderboard by spending more, and earn amazing rewards based on your rank.
          </p>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-6"></div>

          {/* How It Works Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Wrench className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-blue-600">How It Works</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed ml-8">
              Your weekly rank is determined by the total amount spent. The more you spend, the higher you rise on the leaderboard!
            </p>
          </div>

          {/* Rewards Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-blue-600">Rewards</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed ml-8">
              The top players on the leaderboard receive exclusive rewards every week. Aim for the top to unlock the best rewards!
            </p>
          </div>

          {/* Contact Us Section */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-blue-600">Contact Us</h3>
            </div>
            <div className="text-gray-600 text-sm ml-8 space-y-1">
              <p><span className="font-medium">Phone:</span> Contact details available on request</p>
              <p><span className="font-medium">Email:</span> Contact details available on request</p>
              <p><span className="font-medium">Website:</span> Contact details available on request</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trophy Card Component
const TrophyCard = ({ position, user, trophyColor }) => {
  const getTrophyIcon = () => {
    switch (position) {
      case 1:
        return <Trophy className="w-12 h-12 text-yellow-500 mb-4" />;
      case 2:
        return <Trophy className="w-12 h-12 text-gray-400 mb-4" />;
      case 3:
        return <Trophy className="w-12 h-12 text-amber-600 mb-4" />;
      default:
        return <Trophy className="w-12 h-12 text-gray-300 mb-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg min-w-[120px] flex flex-col items-center relative">
      {getTrophyIcon()}
      <div className="text-center">
        <p className="font-semibold text-gray-800 text-sm">
          {user?.name || 'No User'}
        </p>
        <p className="text-gray-600 text-xs">
          {user?.name ? '' : 'Found'}
        </p>
        {user?.totalSpent && (
          <p className="text-xs text-gray-500 mt-1">₹{user.totalSpent.toLocaleString()}</p>
        )}
      </div>
      
      {/* Navigation arrow */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

// Main Leaderboard Page Component
const LeaderboardPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [countdownText, setCountdownText] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeaderboardData([
        // Empty for now - will show "No top users found"
      ]);
      setLoading(false);
    }, 1000);

    // Countdown timer simulation
    const updateCountdown = () => {
      const now = new Date();
      const nextMonday = new Date();
      nextMonday.setDate(now.getDate() + (7 - now.getDay() + 1) % 7);
      nextMonday.setHours(0, 0, 0, 0);
      
      const diff = nextMonday - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setCountdownText(`${days}d ${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const remainingUsers = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-xl font-semibold">Leaderboard</h1>
        </div>
        <button className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Trophy Section */}
      <div style={{ backgroundColor: '#E20001' }} className="px-4 pb-12 pt-8">
        {/* Trophy Cards */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Second Place */}
          <TrophyCard position={2} user={topThree[1]} />
          
          {/* First Place */}
          <TrophyCard position={1} user={topThree[0]} />
          
          {/* Third Place */}
          <TrophyCard position={3} user={topThree[2]} />
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-center">
          <div className="bg-black rounded-full px-6 py-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">
              Challenge Reset in {countdownText}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-4 px-6 text-center font-medium relative ${
              activeTab === 'active'
                ? 'text-black border-b-2 border-green-500'
                : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Active Challenge</span>
              {activeTab === 'active' && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-4 px-6 text-center font-medium relative ${
              activeTab === 'past'
                ? 'text-black border-b-2 border-green-500'
                : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4" />
              <span>Past Reward</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white min-h-[400px] flex items-center justify-center">
        {loading ? (
          <div className="text-gray-500">Loading leaderboard...</div>
        ) : remainingUsers.length > 0 ? (
          <div className="w-full p-4">
            {remainingUsers.map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 4}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">₹{user.totalSpent.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-lg">No top users found</div>
        )}
      </div>
    </div>
  );
};

// Main Component that handles both modal and page states
const LeaderboardSystem = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPage, setShowPage] = useState(false);

  const handleLeaderboardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPage(true);
  };

  const handleBackToMain = () => {
    setShowPage(false);
  };

  if (showPage) {
    return <LeaderboardPage onBack={handleBackToMain} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Demo Header with Leaderboard Button */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Gaming Top-up Store</h1>
          <button
            onClick={handleLeaderboardClick}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </button>
        </div>
        <p className="text-gray-600 mt-2">Click the Leaderboard button to see the challenge popup and leaderboard page.</p>
      </div>

      {/* Demo Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Mobile Legends</h3>
          <p className="text-gray-600 text-sm">Buy diamonds and climb the leaderboard!</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">PUBG Mobile</h3>
          <p className="text-gray-600 text-sm">Purchase UC and compete with others!</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Free Fire</h3>
          <p className="text-gray-600 text-sm">Get diamonds and rise in rankings!</p>
        </div>
      </div>

      {/* Leaderboard Modal */}
      <LeaderboardModal isOpen={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default LeaderboardSystem;
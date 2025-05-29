import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GameDisplay = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState(null);
  const [userInfo, setUserInfo] = useState({ userId: '', serverId: '' });
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchGameDetails();
  }, [gameId]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      
      if (response.ok) {
        setGame(data.game);
      } else {
        console.error('Game not found');
        navigate('/games');
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      navigate('/games');
    } finally {
      setLoading(false);
    }
  };

  const validateUser = async () => {
    if (!userInfo.userId.trim()) {
      alert('Please enter your User ID');
      return;
    }

    try {
      setValidating(true);
      const response = await fetch('/api/games/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          gameId: game._id,
          userId: userInfo.userId,
          serverId: userInfo.serverId || null
        })
      });

      const data = await response.json();
      
      if (response.ok && data.valid) {
        setValidationResult(data.userInfo);
      } else {
        alert(data.message || 'User validation failed');
        setValidationResult(null);
      }
    } catch (error) {
      console.error('Error validating user:', error);
      alert('Failed to validate user. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPack) {
      alert('Please select a pack');
      return;
    }

    if (!validationResult) {
      alert('Please validate your user ID first');
      return;
    }

    try {
      setPurchasing(true);
      // Here you would integrate with your payment system
      // For now, we'll just show a placeholder
      alert('Payment integration coming soon!');
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const getPackPrice = (pack) => {
    if (!user) return pack.retailPrice;
    return user.role === 'reseller' ? pack.resellerPrice : pack.retailPrice;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Game Not Found</h2>
          <button 
            onClick={() => navigate('/games')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Game Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={game.image} 
                alt={game.name}
                className="h-64 w-full object-cover md:h-full"
              />
            </div>
            <div className="p-8 md:w-2/3">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{game.name}</h1>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {game.apiProvider}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {game.region}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{game.description}</p>
              
              {user?.role === 'reseller' && (
                <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Reseller Pricing Active - You get special discounted rates!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Validation Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Player Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User ID *
                  </label>
                  <input
                    type="text"
                    value={userInfo.userId}
                    onChange={(e) => setUserInfo({...userInfo, userId: e.target.value})}
                    placeholder="Enter your game User ID"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {(game.apiProvider === 'yokcash' || game.apiProvider === 'hopestore') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Server ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={userInfo.serverId}
                      onChange={(e) => setUserInfo({...userInfo, serverId: e.target.value})}
                      placeholder="Enter server ID if required"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}

                <button
                  onClick={validateUser}
                  disabled={validating || !userInfo.userId.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validating ? 'Validating...' : 'Validate User'}
                </button>

                {validationResult && (
                  <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">User Validated!</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Player: {validationResult.username || userInfo.userId}
                    </p>
                  </div>
                )}
              </div>

              {selectedPack && validationResult && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Pack:</span>
                      <span className="text-gray-900 dark:text-white">{selectedPack.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-gray-900 dark:text-white">{selectedPack.amount}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-blue-600 dark:text-blue-400">₹{getPackPrice(selectedPack)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                  >
                    {purchasing ? 'Processing...' : 'Purchase Now'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Packs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Available Packs</h2>
              
              {game.packs && game.packs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.packs
                    .filter(pack => pack.isActive !== false)
                    .map((pack) => (
                    <div
                      key={pack.packId}
                      onClick={() => setSelectedPack(pack)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedPack?.packId === pack.packId
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {pack.name}
                        </h3>
                        {selectedPack?.packId === pack.packId && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {pack.amount} {game.name.includes('Mobile Legends') ? 'Diamonds' : 'Credits'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Price:</span>
                          <div className="text-right">
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              ₹{getPackPrice(pack)}
                            </span>
                            {user?.role === 'reseller' && pack.retailPrice !== pack.resellerPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{pack.retailPrice}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {pack.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {pack.description}
                          </p>
                        )}
                      </div>
                      
                      {user?.role === 'reseller' && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Your Profit:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              ₹{pack.retailPrice - pack.resellerPrice}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-3.5m-9 0h-3.5" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Packs Available</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    This game doesn't have any packs configured yet. Please check back later.
                  </p>
                </div>
              )}
            </div>

            {/* Game Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Game Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">API Provider</h4>
                    <p className="text-gray-600 dark:text-gray-400">{game.apiProvider}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Region</h4>
                    <p className="text-gray-600 dark:text-gray-400">{game.region}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Category</h4>
                    <p className="text-gray-600 dark:text-gray-400">{game.category}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Total Packs</h4>
                    <p className="text-gray-600 dark:text-gray-400">{game.packs?.length || 0} available</p>
                  </div>
                  {game.packs && game.packs.length > 0 && (
                    <>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Price Range</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          ₹{Math.min(...game.packs.map(p => user?.role === 'reseller' ? p.resellerPrice : p.retailPrice))} - 
                          ₹{Math.max(...game.packs.map(p => user?.role === 'reseller' ? p.resellerPrice : p.retailPrice))}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">How to Purchase</h2>
              <div className="space-y-2 text-blue-800 dark:text-blue-200">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                  <p>Enter your game User ID (and Server ID if required)</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                  <p>Click "Validate User" to confirm your account details</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                  <p>Select your desired pack from the available options</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                  <p>Review your order and click "Purchase Now" to proceed with payment</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">5</span>
                  <p>Your credits will be delivered instantly after successful payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/games')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Games
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDisplay;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './admin.module.css';
import { usePackManagement } from '../../../hooks/usePackManagement';
import VoucherManagement from './VoucherManagement'
import UserManagement from './UserManagement';
const AdminPanel = () => {
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('games');
  const [showGameForm, setShowGameForm] = useState(false);
  // 1) Core data states
  const [games, setGames] = useState([]);
  const [balances, setBalances] = useState(null);
  const [serverList, setServerList] = useState([]);
  const [availablePacks, setAvailablePacks] = useState([]);
  const [selectedGamePacks, setSelectedGamePacks] = useState([]);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 2) Game form, including provider, game ID, etc.
  const [gameForm, setGameForm] = useState({
    name: '',
    description: '',
    image: '',
    apiProvider: 'smile.one',
    apiGameId: '',
    region: '',
    category: 'Mobile Games'
  });
  const isSmile = gameForm.apiProvider === 'smile.one';

  // 3) Hook for pack editing (only relevant when editing an existing game)
  const {
    editingPack,
    packForm,
    setPackForm,
    handleEditPack,
    handleUpdatePack,
    resetPackForm
  } = usePackManagement(editingGame?._id);

  // ───────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ───────────────────────────────────────────────────────────────────────────

  // A) When apiProvider switches to "smile.one", force region = "BR"
  useEffect(() => {
    if (isSmile) {
      setGameForm(f => ({ ...f, region: 'BR' }));
    }
  }, [isSmile]);

  // B) On first load (and whenever user changes), fetch list of games and balances
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchGames();
      fetchBalances();
    }
  }, [user]);

  // C) Whenever provider, game ID, or editingGame changes, load servers/packs/products
  useEffect(() => {
    const provider = gameForm.apiProvider;
    const gameId   = gameForm.apiGameId?.trim();

    if (provider === 'smile.one' && gameId) {
      fetchApiServers();
      fetchApiPacks();
      if (editingGame) {
        fetchApiPacks();
      } else {
        setAvailablePacks([]);
      }
    }
    else if (provider === 'hopestore' || provider === 'yokcash') {
      // On creation or edit, always fetch provider’s products
      fetchApiProducts(provider);
      setServerList([]); 
    }
    else {
      setServerList([]);
      setAvailablePacks([]);
    }
  }, [gameForm.apiProvider, gameForm.apiGameId, editingGame]);

  // ───────────────────────────────────────────────────────────────────────────
  // FETCH FUNCTIONS
  // ───────────────────────────────────────────────────────────────────────────

  // 1) Fetch balances endpoint (aggregate of 3 providers)
  const fetchBalances = async () => {
    try {
      const res = await fetch(`${API_BASE}/balances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) {
        console.error('fetchBalances failed:', await res.text());
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBalances(data.balances);
      }
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  };

  // 2) Fetch all games
  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/games`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) {
        console.error('fetchGames failed:', await res.text());
        setError('Failed to fetch games');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setGames(data.games || []);
      } else {
        setError(data.message || 'Failed to fetch games');
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Error fetching games');
    } finally {
      setLoading(false);
    }
  };

  // 3) Fetch Smile.one servers for a given game ID
  const fetchApiServers = async () => {
    if (gameForm.apiProvider !== 'smile.one' || !gameForm.apiGameId?.trim()) {
      setServerList([]);
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/games/api-packs/${gameForm.apiGameId.trim()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) {
        console.error('Server-fetch failed:', await res.text());
        setServerList([]);
        return;
      }
      const json = await res.json();
      setServerList(json.servers || []);
    } catch (err) {
      console.error('Error fetching servers:', err);
      setServerList([]);
    }
  };

  // 4) Fetch Smile.one packs for a given game ID (only in edit mode)
   const fetchApiPacks = async () => {
    try {
      const url = `${API_BASE}/games/api-packs/${gameForm.apiGameId}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) {
        console.error('fetchApiPacks failed:', await res.text());
        setAvailablePacks([]);
        return;
      }
      const data = await res.json();
      if (data.success) {
        // Normalize Smile.one packs: data.packs = [ { id, spu, price }, … ]
        const normalized = (data.packs || []).map((item, idx) => ({
          id:    item.id,
          name:  item.spu,            // “78+8 Diamonds”
          price: item.price,  // convert to number
          raw:   item
        }));
        setAvailablePacks(normalized);
      } else {
        setAvailablePacks([]);
      }
    } catch (err) {
      console.error('Error fetching packs:', err);
      setAvailablePacks([]);
    }
  };
  // 5) Fetch Hopestore or Yokcash products (normalized)
   const fetchApiProducts = async (provider) => {
    try {
      const response = await fetch(
        `${API_BASE}/games/api-products/${provider}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();

      if (!data.success || !data.products) {
        setAvailablePacks([]);
        return;
      }

      let normalized = [];
      // Hopestore shape: { success:true, products:{ data:[ { id, nama_layanan, harga, … }, … ] } }
      if (
        provider === 'hopestore' &&
        Array.isArray(data.products.data)
      ) {
        normalized = data.products.data.map((item, idx) => ({
          id:    item.id,
          name:  item.nama_layanan,
          price: item.harga,
          raw:   item
        }));
      }
      // Yokcash shape: { success:true, products:{ data:[ { id, nama_layanan, harga, … }, … ] } }
      else if (
        provider === 'yokcash' &&
        Array.isArray(data.products.data)
      ) {
        normalized = data.products.data.map((item, idx) => ({
          id:    item.id,
          name:  item.nama_layanan,
          price: item.harga,
          raw:   item
        }));
      }
      setAvailablePacks(normalized);
    } catch (error) {
      console.error(`Error fetching API products for ${provider}:`, error);
      setAvailablePacks([]);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ───────────────────────────────────────────────────────────────────────────

  // A) Clear error and success messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // B) Reset game form entirely (for Add New Game or after save)
  const resetGameForm = () => {
    setGameForm({
      name: '',
      description: '',
      image: '',
      apiProvider: 'smile.one',
      apiGameId: '',
      region: '',
      category: 'Mobile Games'
    });
    setSelectedGamePacks([]);
    setServerList([]);
    setAvailablePacks([]);
    resetPackForm();
  };

  // C) Submit (create or update) a game
  const handleGameSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      setLoading(true);
      // 1) Validate required fields
      if (!gameForm.name.trim() ||
          !gameForm.description.trim() ||
          !gameForm.image.trim() ||
          !gameForm.apiGameId.trim() ||
          !gameForm.region.trim()
      ) {
        setError('Please fill all required fields');
        return;
      }
      // 2) Must have at least one pack
      if (selectedGamePacks.length === 0) {
        setError('Please add at least one pack to the game');
        return;
      }
      // 3) Choose correct URL/method
      const url = editingGame
        ? `${API_BASE}/games/${editingGame._id}`
        : `${API_BASE}/games`;
      const method = editingGame ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...gameForm,
          packs: selectedGamePacks
        })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(editingGame ? 'Game updated successfully!' : 'Game created successfully!');
        setShowGameForm(false);
        setEditingGame(null);
        resetGameForm();
        fetchGames();
      } else {
        setError(json.message || 'Failed to save game');
      }
    } catch (err) {
      console.error('Error saving game:', err);
      setError('Error saving game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // D) Add a pack from the API‐populated dropdown
  const handleAddPackFromApi = (e) => {
    const packId = e.target.value;
    if (!packId) return;

    const pack = availablePacks.find(p => p.id === packId);
    if (!pack) return;

    if (selectedGamePacks.some(p => p.packId === pack.id)) {
      setError('Pack already added');
      return;
    }

    const newPack = {
      packId: pack.id,
      name:   pack.name,
      description: pack.raw?.spu || pack.raw?.nama_layanan || '',
      amount: parseFloat(pack.price) || 0,
      retailPrice:  parseFloat(pack.price) || 0,
      resellerPrice: parseFloat(pack.price) * 0.95 || 0,
      costPrice:     parseFloat(pack.price) * 0.90 || 0
    };

    setSelectedGamePacks([...selectedGamePacks, newPack]);
    e.target.value = '';
    clearMessages();
  };
  // E) Manually add or update a pack in the selectedGamePacks array
  const handleAddPackManually = async () => {
    if (!packForm.packId ||
        !packForm.name ||
        !packForm.amount ||
        !packForm.retailPrice ||
        !packForm.resellerPrice ||
        !packForm.costPrice
    ) {
      setError('Please fill all pack fields');
      return;
    }

    if (editingPack) {
      const ok = await handleUpdatePack();
      if (ok) {
        const updated = [...selectedGamePacks];
        const idx = selectedGamePacks.findIndex(p => p.packId === editingPack.packId);
        if (idx > -1) {
          updated[idx] = packForm ;
          setSelectedGamePacks(updated);
        }
      }
    } else {
      const exists = selectedGamePacks.some(p => p.packId === packForm.packId);
      if (exists) {
        setError('Pack ID already exists');
        return;
      }
      setSelectedGamePacks(prev => [...prev, { ...packForm }]);
    }
    resetPackForm();
    clearMessages();
  };

  // F) Remove a pack from selectedGamePacks
  const handleRemovePack = (index) => {
    setSelectedGamePacks(prev => prev.filter((_, i) => i !== index));
    if (editingPack && selectedGamePacks[index]?.packId === editingPack.packId) {
      resetPackForm();
    }
  };

  // G) Populate form for editing an existing game
  const handleEditGame = (game) => {
    setEditingGame(game);
    setGameForm({
      name:        game.name,
      description: game.description,
      image:       game.image,
      apiProvider: game.apiProvider,
      apiGameId:   game.apiGameId,
      region:      game.region,
      category:    game.category
    });
    setSelectedGamePacks(game.packs || []);
    setShowGameForm(true);
    clearMessages();
  };

  // H) Delete a game
  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setSuccess('Game deleted successfully!');
        fetchGames();
      } else {
        setError(json.message || 'Failed to delete game');
      }
    } catch (err) {
      console.error('Error deleting game:', err);
      setError('Error deleting game');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className={`${styles.accessDenied} d-flex align-items-center justify-content-center`}>
        <div className="text-center">
          <h2 className="display-6 mb-3">Access Denied</h2>
          <p className="text-muted">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className="container-fluid py-4">
        <div className="mb-4">
          <h1 className="display-5 fw-bold">Admin Panel</h1>
        </div>

        {/* Balance Display */}
        {balances && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">API Balances</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">Smile.one</h6>
                        <h4 className="text-primary">${balances.smileone || '0.00'}</h4>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">Yokcash</h6>
                        <h4 className="text-success">${balances.yokcash || '0.00'}</h4>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center p-3 border rounded">
                        <h6 className="text-muted">Hopestore</h6>
                        <h4 className="text-warning">${balances.hopestore || '0.00'}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={clearMessages}></button>
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={clearMessages}></button>
          </div>
        )}

       
       {/* Tab Navigation */}
<div className="mb-4">
  <ul className="nav nav-tabs">
    {['games', 'users', 'orders', 'voucher', 'analytics'].map((tab) => (
      <li className="nav-item" key={tab}>
        <button
          className={`nav-link text-capitalize ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      </li>
    ))}
  </ul>
</div>

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">Game Management</h2>
                <button
                  onClick={() => {
                    setShowGameForm(true);
                    resetGameForm();
                    setEditingGame(null);
                    clearMessages();
                    resetPackForm();
                  }}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  Add New Game
                </button>
              </div>

              {/* Games List */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Games List</h5>
                </div>
                <div className="card-body">
                  {loading && !showGameForm ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted">Loading games...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Game</th>
                            <th>API Provider</th>
                            <th>Region</th>
                            <th>Packs</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {games.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-4 text-muted">
                                No games found. Create your first game!
                              </td>
                            </tr>
                          ) : (
                            games.map((game) => (
                              <tr key={game._id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img 
                                      className={`${styles.gameImage} me-3`}
                                      src={game.image} 
                                      alt={game.name}
                                      onError={(e) => {
                                        e.target.src = '/api/placeholder/40/40';
                                      }}
                                    />
                                    <div>
                                      <div className="fw-medium">{game.name}</div>
                                      <small className="text-muted">{game.category}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-primary">{game.apiProvider}</span>
                                </td>
                                <td>{game.region}</td>
                                <td>{game.packs?.length || 0} packs</td>
                                <td>
                                  <button
                                    onClick={() => handleEditGame(game)}
                                    className="btn btn-sm btn-outline-primary me-2"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGame(game._id)}
                                    className="btn btn-sm btn-outline-danger"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Form Modal */}
        {showGameForm && (
          <div className={`${styles.modalBackdrop} modal-backdrop fade show`}>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingGame ? 'Edit Game' : 'Add New Game'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowGameForm(false);
                        setEditingGame(null);
                        resetGameForm();
                        clearMessages();
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleGameSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Game Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={gameForm.name}
                            onChange={(e) => setGameForm({...gameForm, name: e.target.value})}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">API Provider *</label>
                          <select
                            className="form-select"
                            value={gameForm.apiProvider}
                            onChange={(e) => setGameForm({...gameForm, apiProvider: e.target.value})}
                          >
                            <option value="smile.one">Smile.one</option>
                            <option value="yokcash">Yokcash</option>
                            <option value="hopestore">Hopestore</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">API Game ID *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={gameForm.apiGameId}
                            onChange={(e) => setGameForm({...gameForm, apiGameId: e.target.value})}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Region (Server) *</label>
                          {isSmile ? (
                            <select className="form-select" value="BR" disabled>
                              <option value="BR">Brazil</option>
                            </select>
                          ) : (
                            <select
                              className="form-select"
                              value={gameForm.region}
                              onChange={e =>
                                setGameForm({ ...gameForm, region: e.target.value })
                              }
                              required
                            >
                              <option value="">Select server</option>
                              {serverList.length > 0
                                ? serverList.map(s => (
                                    <option key={s.server_id} value={s.server_id}>
                                      {s.server_name}
                                    </option>
                                  ))
                                : (
                                    <option value="0">Global</option>
                                  )}
                            </select>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={gameForm.category}
                            onChange={(e) => setGameForm({...gameForm, category: e.target.value})}
                          >
                            <option value="Mobile Games">Mobile Games</option>
                            <option value="PC Games">PC Games</option>
                            <option value="Console Games">Console Games</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Image URL *</label>
                          <input
                            type="url"
                            className="form-control"
                            value={gameForm.image}
                            onChange={(e) => setGameForm({...gameForm, image: e.target.value})}
                            required
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label">Description *</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={gameForm.description}
                            onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Pack Management Section */}
                      <div className="border-top pt-4 mt-4">
                        <h5 className="mb-3">Game Packs</h5>
                        
                        {/* Add Pack from API - Only show for Smile.one when editing existing game */}
                       
      { (gameForm.apiProvider === 'smile.one' ||
         gameForm.apiProvider === 'hopestore' ||
         gameForm.apiProvider === 'yokcash') &&
        availablePacks.length > 0 && (
         <div className="card mb-3">
           <div className="card-body">
             <h6 className="card-title">
               Add Pack from{' '}
               {gameForm.apiProvider === 'smile.one'
                 ? 'Smile.one'
                 : gameForm.apiProvider === 'hopestore'
                 ? 'Hopestore'
                 : 'Yokcash'}{' '}
               API
             </h6>
             <select
               className="form-select"
               onChange={handleAddPackFromApi}
               defaultValue=""
             >
               <option value="" disabled>
                 Choose a pack to add
               </option>
               {availablePacks.map((p, idx) => (
                 <option key={`${p.id}-${idx}`} value={p.id}>
                   {p.name} — ₹{p.price}
                 </option>
               ))}
             </select>
           </div>
         </div>
      ) }

                        {/* Manual Pack Entry - Always show for all providers */}
                        <div className="card mb-3">
                          <div className="card-body">
                            <h6 className="card-title">
                              {editingPack !== null ? 'Edit Pack' : 'Add Pack Manually'}
                            </h6>
                            <div className="row g-2">
                              <div className="col-md-2">
                                <label className="form-label">Pack ID</label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Pack ID"
                                  value={packForm.packId}
                                  onChange={(e) => setPackForm({...packForm, packId: e.target.value})}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Pack Name</label>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Pack Name"
                                  value={packForm.name}
                                  onChange={(e) => setPackForm({...packForm, name: e.target.value})}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Amount</label>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  placeholder="Amount"
                                  value={packForm.amount}
                                  onChange={(e) => setPackForm({...packForm, amount: e.target.value})}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Retail Price</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control form-control-sm"
                                  placeholder="Retail Price"
                                  value={packForm.retailPrice}
                                  onChange={(e) => setPackForm({...packForm, retailPrice: e.target.value})}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Reseller Price</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control form-control-sm"
                                  placeholder="Reseller Price"
                                  value={packForm.resellerPrice}
                                  onChange={(e) => setPackForm({...packForm, resellerPrice: e.target.value})}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="form-label">Cost Price</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control form-control-sm"
                                  placeholder="Cost Price"
                                  value={packForm.costPrice}
                                  onChange={(e) => setPackForm({...packForm, costPrice: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={handleAddPackManually}
                                className={`btn btn-sm ${editingPack !== null ? 'btn-primary' : 'btn-success'}`}
                              >
                                {editingPack !== null ? 'Update Pack' : 'Add Pack'}
                              </button>
                              {editingPack !== null && (
                                <button
                                  type="button"
                                  onClick={resetPackForm}
                                  className="btn btn-sm btn-secondary ms-2"
                                >
                                  Cancel Edit
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Packs List */}
                        {selectedGamePacks.length > 0 && (
                          <div className="table-responsive">
                            <table className="table table-sm table-striped">
                              <thead className="table-secondary">
                                <tr>
                                  <th>Pack ID</th>
                                  <th>Name</th>
                                  <th>Amount</th>
                                  <th>Cost</th>
                                  <th>Retail</th>
                                  <th>Reseller</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                               {selectedGamePacks.map((pack, index) => (
  <tr key={index}>
    <td>{pack.packId}</td>
    <td>{pack.name}</td>
    <td>{pack.amount}</td>
    <td>₹{pack.costPrice}</td>
    <td>₹{pack.retailPrice}</td>
    <td>₹{pack.resellerPrice}</td>
    <td>
      <button
        type="button"
        onClick={() => handleEditPack(pack)} // Use the hook's handleEditPack
        className="btn btn-sm btn-outline-primary me-2"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => handleRemovePack(index)}
        className="btn btn-sm btn-outline-danger"
      >
        Remove
      </button>
    </td>
  </tr>
))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                        {/* Updated Balances Section */}
    {balances && (
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Provider Balances</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <h6 className="text-muted">Yokcash</h6>
                <h4 className="text-success">₹{balances.yokcash?.data || '0.00'}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <h6 className="text-muted">Hopestore</h6>
                <h4 className="text-warning">₹{balances.hopestore?.data || '0.00'}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-3 border rounded">
                <h6 className="text-muted">Smile.one</h6>
                <h4 className="text-primary">{balances.smileone?.smile_points || '0'} points</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowGameForm(false);
                        setEditingGame(null);
                        resetGameForm();
                        resetPackForm();
                        clearMessages();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="gameForm"
                      disabled={loading}
                      className="btn btn-primary"
                      onClick={handleGameSubmit}
                    >
                      {loading ? 'Saving...' : (editingGame ? 'Update Game' : 'Create Game')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
              
{activeTab === 'users' && (
  <div className="row">
    <div className="col-12">
      <UserManagement />
    </div>
  </div>
)}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">Order Management</h2>
              </div>
              <div className="card">
                <div className="card-body">
                  <p className="text-muted">Order management features coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voucher Tab */}
{activeTab === 'voucher' && (
  <div className="row">
    <div className="col-12">
      <VoucherManagement />
    </div>
  </div>
)}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">Analytics</h2>
              </div>
              <div className="card">
                <div className="card-body">
                  <p className="text-muted">Analytics dashboard coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}

    

      </div>
    </div>
  );
};

export default AdminPanel;
import React, { useState, useEffect } from 'react';
import { bannerAPI, validateBannerForm, handleApiError, showSuccessMessage } from '../../utils/api';
import './BannerManager.css';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    altText: '',
    link: '',
    title: '',
    category: 'games',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBanners();
  }, []);

const fetchBanners = async () => {
  try {
    const data = await bannerAPI.admin.getBanners();
    setBanners(data);
  } catch (error) {
    console.error('Error fetching banners:', error);
  } finally {
    setLoading(false);
  }
};

const validateForm = () => {
  const validation = validateBannerForm(formData);
  setErrors(validation.errors);
  return validation.isValid;
};

  const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (editingBanner) {
      await bannerAPI.admin.updateBanner(editingBanner._id, formData);
      showSuccessMessage('Banner updated successfully');
    } else {
      await bannerAPI.admin.createBanner(formData);
      showSuccessMessage('Banner created successfully');
    }
    
    await fetchBanners();
    resetForm();
  } catch (error) {
    console.error('Error saving banner:', error);
    alert(handleApiError(error, 'Failed to save banner'));
  }
};

  const deleteBanner = async (id) => {
  if (!window.confirm('Are you sure you want to delete this banner?')) return;
  
  try {
    await bannerAPI.admin.deleteBanner(id);
    showSuccessMessage('Banner deleted successfully');
    await fetchBanners();
  } catch (error) {
    console.error('Error deleting banner:', error);
    alert(handleApiError(error, 'Failed to delete banner'));
  }
};

  const editBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      imageUrl: banner.imageUrl,
      altText: banner.altText,
      link: banner.link,
      title: banner.title || '',
      category: banner.category,
      isActive: banner.isActive
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      altText: '',
      link: '',
      title: '',
      category: 'games',
      isActive: true
    });
    setEditingBanner(null);
    setShowForm(false);
    setErrors({});
  };

  const moveBanner = async (index, direction) => {
  const newBanners = [...banners];
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  
  if (targetIndex < 0 || targetIndex >= newBanners.length) return;
  
  [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];
  
  try {
    const bannerIds = newBanners.map(banner => banner._id);
    await bannerAPI.admin.reorderBanners(bannerIds);
    setBanners(newBanners);
    showSuccessMessage('Banners reordered successfully');
  } catch (error) {
    console.error('Error reordering banners:', error);
    alert(handleApiError(error, 'Failed to reorder banners'));
  }
};

  if (loading) return <div className="loading">Loading banners...</div>;

  return (
    <div className="banner-manager">
      <div className="header">
        <h2>Banner Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Banner
        </button>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <div>
              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
              </div>

              <div className="form-group">
                <label>Alt Text *</label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({...formData, altText: e.target.value})}
                  placeholder="Describe the image"
                />
                {errors.altText && <span className="error">{errors.altText}</span>}
              </div>

              <div className="form-group">
                <label>Link URL *</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://example.com/destination"
                />
                {errors.link && <span className="error">{errors.link}</span>}
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Banner title (optional)"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="games">Games</option>
                    <option value="giftcards">Gift Cards</option>
                    <option value="promotions">Promotions</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleSubmit} className="btn-primary">
                  {editingBanner ? 'Update' : 'Create'} Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="banner-list">
        {banners.length === 0 ? (
          <div className="empty-state">
            <p>No banners found. Create your first banner!</p>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div key={banner._id} className={`banner-item ${!banner.isActive ? 'inactive' : ''}`}>
              <div className="banner-preview">
                <img src={banner.imageUrl} alt={banner.altText} />
              </div>
              
              <div className="banner-info">
                <h4>{banner.title || banner.altText}</h4>
                <p className="category">{banner.category}</p>
                <p className="link">{banner.link}</p>
                <span className={`status ${banner.isActive ? 'active' : 'inactive'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="banner-actions">
                <div className="order-controls">
                  <button 
                    onClick={() => moveBanner(index, 'up')}
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={() => moveBanner(index, 'down')}
                    disabled={index === banners.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
                
                <button onClick={() => editBanner(banner)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => deleteBanner(banner._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BannerManager;
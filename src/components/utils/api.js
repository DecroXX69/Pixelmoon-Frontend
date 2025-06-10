// API utility functions for banner management

// In api.js, replace the first line:
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Generic API call handler
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// Banner API functions
export const bannerAPI = {
  // Get all banners (public)
  getPublicBanners: () => apiCall('/banners'),

  // Admin banner operations
  admin: {
    // Get all banners for admin
    getBanners: () => apiCall('/admin/banners'),

    // Create new banner
    createBanner: (bannerData) => 
      apiCall('/admin/banners', {
        method: 'POST',
        body: JSON.stringify(bannerData),
      }),

    // Update banner
    updateBanner: (id, bannerData) => 
      apiCall(`/admin/banners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bannerData),
      }),

    // Delete banner
    deleteBanner: (id) => 
      apiCall(`/admin/banners/${id}`, {
        method: 'DELETE',
      }),

    // Reorder banners
    reorderBanners: (bannerIds) => 
      apiCall('/admin/banners/reorder', {
        method: 'PUT',
        body: JSON.stringify({ bannerIds }),
      }),
  },
};

// Image validation utility
export const validateImageUrl = (url) => {
  const imageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
  return imageRegex.test(url);
};

// Form validation utilities
export const validateBannerForm = (data) => {
  const errors = {};

  if (!data.imageUrl?.trim()) {
    errors.imageUrl = 'Image URL is required';
  } else if (!validateImageUrl(data.imageUrl)) {
    errors.imageUrl = 'Please provide a valid image URL (jpg, jpeg, png, gif, webp)';
  }

  if (!data.altText?.trim()) {
    errors.altText = 'Alt text is required';
  } else if (data.altText.length > 100) {
    errors.altText = 'Alt text must be less than 100 characters';
  }

  if (!data.link?.trim()) {
    errors.link = 'Link URL is required';
  }

  if (data.title && data.title.length > 50) {
    errors.title = 'Title must be less than 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Error handling utility
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.message) {
    return error.message;
  }
  return defaultMessage;
};

// Success notification utility
export const showSuccessMessage = (message) => {
  // You can integrate with your notification system here
  console.log('Success:', message);
  // Example: toast.success(message);
};

// Loading state management
export const createLoadingState = () => {
  let loadingStates = {};

  return {
    setLoading: (key, isLoading) => {
      loadingStates[key] = isLoading;
    },
    
    isLoading: (key) => loadingStates[key] || false,
    
    clearAll: () => {
      loadingStates = {};
    }
  };
};
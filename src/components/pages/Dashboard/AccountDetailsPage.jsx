import React, { useState, useEffect } from 'react';
import { Edit3, X, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import styles from './AccountDetailsPage.module.css';

export const AccountDetailsPage = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    state: '',
    role: 'user'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
 const API_URL = import.meta.env.VITE_API_URL || 'https://pixelmoonstore.in/api';
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          name: data.user.name || '',
          email: data.user.email || '',
          mobile: data.user.mobile || '',
          gender: data.user.gender || '',
          state: data.user.state || '',
          role: data.user.role || 'user'
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: userDetails.name,
          gender: userDetails.gender,
          state: userDetails.state,
          ...(passwords.new && { 
            currentPassword: passwords.current,
            newPassword: passwords.new 
          })
        })
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw size={32} />
        <p>Loading account details...</p>
      </div>
    );
  }

  return (
    <div className={styles.accountPage}>
      <div className={styles.pageHeader}>
        <h2>Account Details</h2>
        <p>Manage your personal information and security settings</p>
      </div>
      
      <div className={styles.accountContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {userDetails.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h3>{userDetails.name}</h3>
            <span className={`${styles.roleBadge} ${styles[userDetails.role]}`}>
              {userDetails.role.toUpperCase()}
            </span>
          </div>
          <div className={styles.profileActions}>
            <button
              className={styles.btnOutline}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X size={16} /> : <Edit3 size={16} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className={styles.profileForm}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                className={styles.formControl}
                value={userDetails.name}
                onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                className={styles.formControl}
                value={userDetails.email}
                disabled
              />
              <small className={styles.formText}>Email cannot be changed</small>
            </div>

            <div className={styles.formGroup}>
              <label>Mobile Number</label>
              <input
                type="text"
                className={styles.formControl}
                value={userDetails.mobile}
                disabled
              />
              <small className={styles.formText}>Mobile number cannot be changed</small>
            </div>

            <div className={styles.formGroup}>
              <label>Gender</label>
              <select
                className={styles.formControl}
                value={userDetails.gender}
                onChange={(e) => setUserDetails({...userDetails, gender: e.target.value})}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroupFull}>
              <label>State</label>
              <input
                type="text"
                className={styles.formControl}
                placeholder="Enter your state"
                value={userDetails.state}
                onChange={(e) => setUserDetails({...userDetails, state: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className={styles.passwordSection}>
              <h4>Change Password (Optional)</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Current Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPassword.current ? "text" : "password"}
                      className={styles.formControl}
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>New Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      className={styles.formControl}
                      placeholder="Enter new password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Confirm Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      className={styles.formControl}
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className={styles.formActions}>
              <button
                className={styles.btnPrimary}
                onClick={handleUpdateProfile}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <RefreshCw size={16} className={styles.spin} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
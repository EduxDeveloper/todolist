import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await axios.put('/api/profile/password', { currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating password');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="container" style={{maxWidth: '800px'}}>
        <div className="glass-panel" style={{padding: '3rem'}}>
          <h2 className="text-gradient mb-4">My Profile</h2>
          
          <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
            {/* Profile Info */}
            <div style={{flex: '1 1 300px'}}>
              <h3 className="mb-4">Information</h3>
              <div className="mb-4">
                <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '0.2rem'}}>Name</p>
                <p style={{fontSize: '1.1rem'}}>{user.name} {user.lastName}</p>
              </div>
              <div className="mb-4">
                <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '0.2rem'}}>Email</p>
                <p style={{fontSize: '1.1rem'}}>{user.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '0.2rem'}}>Account Created</p>
                <p style={{fontSize: '1.1rem'}}>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Change Password */}
            <div style={{flex: '1 1 300px'}}>
              <h3 className="mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="input-group">
                  <label>Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                </div>
                <div className="input-group">
                  <label>Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} /> Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/register/verifyCodeEmail', { verificationCodeRequest: code });
      toast.success('Email verified successfully! You can now login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h2 className="text-center text-gradient mb-4">Verify Email</h2>
        <p className="text-center text-muted mb-4">Enter the 6-character code sent to your email.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Verification Code</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} required maxLength={6} placeholder="e.g. a1b2c3" />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            <CheckCircle size={20} /> Verify
          </button>
        </form>
      </div>
    </div>
  );
}

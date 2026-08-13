import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/password/forgot', { email });
      toast.success('Recovery code sent to your email.');
      // Pass the email in state so the next page knows it
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending recovery email');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h2 className="text-center text-gradient mb-4">Forgot Password</h2>
        <p className="text-center text-muted mb-4">Enter your email to receive a recovery code.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
            <Send size={20} /> Send Code
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="flex-between" style={{width: '100%'}}>
        <div className="logo text-gradient" style={{fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <CheckSquare /> ToDo App
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            <User size={18} style={{marginRight: '0.25rem', verticalAlign: 'text-bottom'}} /> 
            Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

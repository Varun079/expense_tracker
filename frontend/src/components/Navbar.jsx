import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="glass-nav">
            <div className="logo">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    💰 Expense<span style={{ color: '#2575fc' }}>Tracker</span>
                </Link>
            </div>
            <div className="nav-links">
                {token ? (
                    <button onClick={handleLogout} className="btn btn-logout">
                        Logout
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" className="btn" style={{ color: '#fff' }}>Login</Link>
                        <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

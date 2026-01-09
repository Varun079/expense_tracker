import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.accessToken);
            navigate('/'); // Redirect to Dashboard
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
                {error && <p style={{ color: '#ff3b30', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Login
                    </button>

                    <div style={{ margin: '1rem 0', textAlign: 'center', position: 'relative' }}>
                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0 0.5rem', color: '#b3b3b3', fontSize: '0.8rem' }}>OR</span>
                    </div>

                    <a href="http://localhost:8080/oauth2/authorization/google" className="btn" style={{
                        width: '100%',
                        display: 'block',
                        textAlign: 'center',
                        background: '#fff',
                        color: '#333',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}>
                        <span style={{ marginRight: '0.5rem' }}>G</span> Sign in with Google
                    </a>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: '#b3b3b3' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#2575fc' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

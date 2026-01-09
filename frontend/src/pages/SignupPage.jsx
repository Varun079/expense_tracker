import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', formData);
            navigate('/login'); // Redirect to Login after signup
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Username might be taken.');
        }
    };

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
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
                        Sign Up
                    </button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: '#b3b3b3' }}>
                    Already have an account? <Link to="/login" style={{ color: '#2575fc' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;

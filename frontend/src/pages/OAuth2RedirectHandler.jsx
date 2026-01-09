import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            console.log('OAuth2 login successful, token saved');
            navigate('/');
        } else {
            console.error('No token found in OAuth2 redirect');
            navigate('/login');
        }
    }, [navigate, searchParams]);

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="glass-panel" style={{ textAlign: 'center' }}>
                <h3>Authenticating...</h3>
                <p>Please wait while we redirect you.</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;

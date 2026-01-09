import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const AddTransaction = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('expense'); // 'expense' or 'income'
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'PERSONAL', // Default for expense
        source: 'SALARY' // Default for income
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                description: formData.description,
                amount: parseFloat(formData.amount),
                date: formData.date,
            };

            if (type === 'expense') {
                payload.category = formData.category;
                await api.post('/expenses', payload);
            } else {
                payload.source = formData.source;
                await api.post('/incomes', payload);
            }

            navigate('/');
        } catch (error) {
            alert('Failed to add transaction');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="glass-panel" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                    <button
                        onClick={() => navigate('/')}
                        className="btn"
                        style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    >
                        ← Back
                    </button>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Add New {type === 'expense' ? 'Expense' : 'Income'}</h2>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
                        <button
                            className={`btn ${type === 'expense' ? 'btn-primary' : ''}`}
                            style={{ background: type !== 'expense' ? 'rgba(255,255,255,0.1)' : '' }}
                            onClick={() => setType('expense')}
                        >
                            Expense
                        </button>
                        <button
                            className={`btn ${type === 'income' ? 'btn-primary' : ''}`}
                            style={{ background: type !== 'income' ? 'rgba(255,255,255,0.1)' : '' }}
                            onClick={() => setType('income')}
                        >
                            Income
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input name="description" className="form-input" required onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount</label>
                            <input name="amount" type="number" step="0.01" className="form-input" required onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input name="date" type="date" className="form-input" value={formData.date} required onChange={handleChange} />
                        </div>

                        {type === 'expense' ? (
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select name="category" className="form-input" onChange={handleChange} value={formData.category}>
                                    <option value="PERSONAL">Personal</option>
                                    <option value="SURVIVAL_LIVELIHOOD">Survival/Livelihood</option>
                                    <option value="INVESTMENT">Investment</option>
                                </select>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">Source</label>
                                <select name="source" className="form-input" onChange={handleChange} value={formData.source}>
                                    <option value="SALARY">Salary</option>
                                    <option value="FROM_INVESTMENT">Investment</option>
                                    <option value="FROM_TRADING">Trading</option>
                                </select>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Transaction</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddTransaction;

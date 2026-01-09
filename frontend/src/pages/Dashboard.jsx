import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TransactionTable from '../components/TransactionTable';
import api from '../services/api';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [pnl, setPnl] = useState(0);
    const navigate = useNavigate();

    // Filters & Sorting State
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        category: '',
        source: '',
        sortBy: 'date' // Default sort
    });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const fetchData = async () => {
        try {
            // Construct Query String
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.minAmount) params.append('minAmount', filters.minAmount);
            if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);

            // For specific filters
            const expenseParams = new URLSearchParams(params);
            if (filters.category) expenseParams.append('category', filters.category);

            const incomeParams = new URLSearchParams(params);
            if (filters.source) incomeParams.append('source', filters.source);

            // API Calls
            const [expensesRes, incomesRes, pnlRes] = await Promise.all([
                api.get(`/expenses?${expenseParams.toString()}`),
                api.get(`/incomes?${incomeParams.toString()}`),
                api.get('/pnl') // PnL usually considers all time or we could add dates too if backend supported it
            ]);

            setExpenses(expensesRes.data);
            setIncomes(incomesRes.data);
            setPnl(pnlRes.data);
        } catch (error) {
            console.error(error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // navigate('/login'); // Commented out to prevent redirect loops during testing if token invalid
            }
        }
    };

    // Refetch ONLY on mount or when explicitly called
    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteExpense = async (id) => {
        if (window.confirm('Delete this expense?')) {
            await api.delete(`/expenses/${id}`);
            fetchData();
        }
    };

    const handleDeleteIncome = async (id) => {
        if (window.confirm('Delete this income?')) {
            await api.delete(`/incomes/${id}`);
            fetchData();
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="glass-panel" style={{ textAlign: 'center' }}>
                        <h3>Total PnL</h3>
                        <h1 style={{ color: pnl >= 0 ? '#4cd964' : '#ff3b30', fontSize: '2.5rem', margin: '0.5rem 0' }}>₹{pnl}</h1>
                        <p style={{ color: '#b3b3b3' }}>Net Profit / Loss</p>
                    </div>
                    <div className="glass-panel flex-center" style={{ flexDirection: 'column' }}>
                        <Link to="/add" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
                            + Add Transaction
                        </Link>
                    </div>
                </div>

                {/* Filters Section (Collapsible) */}
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '1rem' }}
                    >
                        {showFilters ? 'Hide Filters 🔼' : 'Show Filters / Sort 🔽'}
                    </button>

                    {showFilters && (
                        <div className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {/* Date Range */}
                                <div className="form-group">
                                    <label className="form-label">Start Date</label>
                                    <input type="date" name="startDate" className="form-input" onChange={handleFilterChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Date</label>
                                    <input type="date" name="endDate" className="form-input" onChange={handleFilterChange} />
                                </div>

                                {/* Amount Range */}
                                <div className="form-group">
                                    <label className="form-label">Min Amount</label>
                                    <input type="number" name="minAmount" placeholder="0" className="form-input" onChange={handleFilterChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Amount</label>
                                    <input type="number" name="maxAmount" placeholder="Max" className="form-input" onChange={handleFilterChange} />
                                </div>

                                {/* Sorting */}
                                <div className="form-group">
                                    <label className="form-label">Sort By</label>
                                    <select name="sortBy" className="form-input" onChange={handleFilterChange} value={filters.sortBy}>
                                        <option value="date">Date</option>
                                        <option value="amount">Amount</option>
                                        <option value="category">Category / Source</option>
                                    </select>
                                </div>

                                {/* Type Filter */}
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select name="type" className="form-input" onChange={handleFilterChange} value={filters.type}>
                                        <option value="all">All</option>
                                        <option value="expense">Expenses Only</option>
                                        <option value="income">Incomes Only</option>
                                    </select>
                                </div>

                                {/* Filters */}
                                <div className="form-group">
                                    <label className="form-label">Category (Exp)</label>
                                    <select name="category" className="form-input" onChange={handleFilterChange}>
                                        <option value="">All</option>
                                        <option value="PERSONAL">Personal</option>
                                        <option value="SURVIVAL_LIVELIHOOD">Survival</option>
                                        <option value="INVESTMENT">Investment</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Source (Inc)</label>
                                    <select name="source" className="form-input" onChange={handleFilterChange}>
                                        <option value="">All</option>
                                        <option value="SALARY">Salary</option>
                                        <option value="FROM_INVESTMENT">Inv. Return</option>
                                        <option value="FROM_TRADING">Trading</option>
                                    </select>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={fetchData} className="btn btn-primary">
                                    Apply Configuration
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Transactions */}
                <div style={{ display: 'grid', gridTemplateColumns: (filters.type === 'expense' || filters.type === 'income') ? '1fr' : '1fr 1fr', gap: '2rem' }}>

                    {/* Expenses Column */}
                    {(filters.type !== 'income') && (
                        <div>
                            <h2 style={{ marginBottom: '1rem', color: '#ff3b30' }}>Expenses</h2>
                            <div className="glass-panel" style={{ padding: '1rem' }}>
                                <TransactionTable transactions={expenses} type="expense" onDelete={handleDeleteExpense} />
                            </div>
                        </div>
                    )}

                    {/* Incomes Column */}
                    {(filters.type !== 'expense') && (
                        <div>
                            <h2 style={{ marginBottom: '1rem', color: '#4cd964' }}>Incomes</h2>
                            <div className="glass-panel" style={{ padding: '1rem' }}>
                                <TransactionTable transactions={incomes} type="income" onDelete={handleDeleteIncome} />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Dashboard;

const TransactionTable = ({ transactions, type, onDelete }) => {
    if (!transactions.length) {
        return <p style={{ color: '#b3b3b3', textAlign: 'center' }}>No {type}s found.</p>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Description</th>
                        <th style={{ padding: '1rem' }}>Category/Source</th>
                        <th style={{ padding: '1rem' }}>Date</th>
                        <th style={{ padding: '1rem' }}>Amount</th>
                        <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem' }}>{t.description}</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}>
                                    {t.category || t.source}
                                </span>
                            </td>
                            <td style={{ padding: '1rem', color: '#b3b3b3' }}>{t.date}</td>
                            <td style={{ padding: '1rem', fontWeight: 'bold', color: type === 'income' ? '#4cd964' : '#ff3b30' }}>
                                {type === 'income' ? '+' : '-'} ₹{t.amount}
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <button
                                    onClick={() => onDelete(t.id)}
                                    className="btn"
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        fontSize: '0.8rem',
                                        background: 'rgba(255,59,48,0.1)',
                                        color: '#ff3b30'
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;

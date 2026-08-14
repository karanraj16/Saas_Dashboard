import React from 'react';

const TransactionTable = ({ transactions, handleDelete }) => {
  
  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
      case 'waiting':
        return { bg: 'var(--bg-warning)', text: 'var(--text-warning)' };
      case 'failed':
      case 'cancelled':
        return { bg: '#fee2e2', text: '#ef4444' }; // Red shades
      default:
        return { bg: 'var(--bg-success)', text: 'var(--text-success)' };
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <th style={{ padding: '12px 0', fontWeight: 500 }}>Transaction ID</th>
            <th style={{ padding: '12px 0', fontWeight: 500 }}>Date</th>
            <th style={{ padding: '12px 0', fontWeight: 500 }}>Amount</th>
            <th style={{ padding: '12px 0', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '12px 0', fontWeight: 500 }}>Action</th> {/* 🚀 Delete Column */}
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.length > 0 ? (
            transactions.map((txn) => {
              const statusStyle = getStatusStyle(txn.status);
              return (
                <tr key={txn._id || Math.random()} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '14px' }}>
                  <td style={{ padding: '12px 0' }}>{txn._id ? txn._id.substring(0, 8) + '...' : 'N/A'}</td>
                  <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>
                    {new Date(txn.date || txn.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>
                    ${txn.amount ? txn.amount.toLocaleString() : '0'}
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, background: statusStyle.bg, color: statusStyle.text }}>
                      {txn.status || 'Completed'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    {/* 🚀 Delete Button */}
                    <button onClick={() => handleDelete(txn._id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
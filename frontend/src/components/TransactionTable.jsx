import React, { useState, useMemo } from 'react';

const TransactionTable = ({ transactions, handleDelete }) => {
  // States for Smart Table
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // 🎨 Status Styles
  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
      case 'waiting': return { bg: 'var(--bg-warning)', text: 'var(--text-warning)' };
      case 'failed':
      case 'cancelled': return { bg: '#fee2e2', text: '#ef4444' };
      default: return { bg: 'var(--bg-success)', text: 'var(--text-success)' };
    }
  };

  // 🔍 1. Search & Filter Logic
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(txn => {
      const matchesSearch = (txn.user || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  // ↕️ 2. Sorting Logic
  const sortedTransactions = useMemo(() => {
    let sortableItems = [...filteredTransactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'date') {
          aValue = new Date(a.date || a.createdAt).getTime();
          bValue = new Date(b.date || b.createdAt).getTime();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTransactions, sortConfig]);

  // 📖 3. Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  // Sorting Handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Reset page when filtering
  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  return (
    <div>
      {/* 🚀 TOP BAR: Search & Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="🔍 Search descriptions..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
        />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* 📝 TABLE */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--surface-1)' }}>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Description</th>
              <th onClick={() => requestSort('date')} style={{ padding: '12px 16px', fontWeight: 500, cursor: 'pointer' }}>
                Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th onClick={() => requestSort('amount')} style={{ padding: '12px 16px', fontWeight: 500, cursor: 'pointer' }}>
                Amount {sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((txn) => {
                const statusStyle = getStatusStyle(txn.status);
                return (
                  <tr key={txn._id} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '14px', background: 'var(--surface-2)' }}>
                    <td style={{ padding: '12px 16px' }}>{txn.user || 'N/A'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {new Date(txn.date || txn.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                      ${txn.amount ? txn.amount.toLocaleString() : '0'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: statusStyle.bg, color: statusStyle.text }}>
                        {txn.status || 'Completed'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => handleDelete(txn._id)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📖 BOTTOM BAR: Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing {sortedTransactions.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedTransactions.length)} of {sortedTransactions.length} transactions
        </span>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)', background: currentPage === 1 ? 'var(--surface-1)' : 'var(--fill-accent)', color: currentPage === 1 ? 'var(--text-secondary)' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Prev
          </button>
          
          <button 
            disabled={currentPage === totalPages || totalPages === 0} 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border)', background: currentPage === totalPages || totalPages === 0 ? 'var(--surface-1)' : 'var(--fill-accent)', color: currentPage === totalPages || totalPages === 0 ? 'var(--text-secondary)' : '#fff', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
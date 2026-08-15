import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getTransactions ,createTransaction,removeTransaction } from '../services/api';
import Sidebar from '../components/Sidebar';
import ProfileModal from '../components/ProfileModal';
import RenderChart from '../components/RenderChart';
import TransactionTable from '../components/TransactionTable';

// Recharts for the inline Donut Chart
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // States
  const [userData, setUserData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const COLORS = ['var(--fill-accent)', 'var(--fill-success)', 'var(--fill-warning)', 
    '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#6366f1'];
  const generateChartData = (txns) => {
    if (!txns || txns.length === 0) return [{ name: 'No Data', value: 1 }];
    
    // Transactions-a unga 'description/user' base panni group pandrom
    const grouped = txns.reduce((acc, curr) => {
      const key = curr.user || 'General';
      acc[key] = (acc[key] || 0) + curr.amount;
      return acc;
    }, {});

      let sortedData = Object.keys(grouped)
        .map(key => ({name: key,
        value: grouped[key]
        }))
        .sort((a,b) => b.value - a.value);

      if(sortedData.length > 5){
      const top5 = sortedData.slice(0, 5);
      const othersValue = sortedData.slice(5).reduce((sum, item) => sum + item.value, 0);
      top5.push({ name: 'Others', value: othersValue });
      return top5;
      }
      return sortedData;
  };
  
  const dynamicChartData = generateChartData(transactions);

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      setErrorMsg("No data available to export!");
      return;
    }
    
    let csvContent = "Transaction ID,Description,Amount,Date,Status\n";
    transactions.forEach(row => {
      const date = new Date(row.date || row.createdAt).toLocaleDateString();
      csvContent += `${row._id},${row.user},${row.amount},${date},${row.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "SaaSDash_Transactions.csv"); // File Name
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSuccessMsg('📥 CSV File Downloaded Successfully!');
  };

  // 3. REAL PUBLIC LINK FUNCTION
  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/dashboard`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setSuccessMsg('🔗 Public link copied to clipboard!');
    });
  };

  // Dark Mode Applicator
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch Data & Check Payment
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      setSuccessMsg('🎉 Payment Successful! Welcome to SaaS Dash PRO!');
      window.history.replaceState(null, '', window.location.pathname);
    } else if (query.get('payment') === 'cancel') {
      setErrorMsg('Payment was cancelled. You can upgrade anytime later!');
      window.history.replaceState(null, '', window.location.pathname);
    }

    const fetchData = async () => {
      try {
        const user = await getUserProfile();
        setUserData(user);
        const trans = await getTransactions();
        setTransactions(trans);
      } catch (error) {
        setErrorMsg('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await removeTransaction(id);
        setTransactions(transactions.filter(t => t._id !== id));
        setSuccessMsg("Transaction deleted successfully!");
      } catch (err) {
        setErrorMsg("Failed to delete transaction");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--surface-0)', color: 'var(--text-primary)' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <span className="ml-4 text-xl font-bold">Loading Workspace...</span>
      </div>
    );
  }

  const totalRevenue = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div style={{ background: 'var(--surface-0)', fontFamily: 'sans-serif', display: 'flex', height: '100vh', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <Sidebar 
        userData={userData} 
        setShowProfile={setShowProfile} 
        handleLogout={handleLogout} 
        exportToCSV={handleExportCSV}
        copyPublicLink={handleCopyLink}
      />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR */}
        <div style={{ background: 'var(--surface-2)', borderBottom: '0.5px solid var(--border)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Welcome back, {userData.name} 👋</h1>
            <p style={{ fontSize: '13px', margin: '4px 0 0', color: 'var(--text-secondary)' }}>Here's your business performance this month</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select style={{ padding: '8px 12px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ width: '36px', height: '36px', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface-1)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* ALERTS */}
          {successMsg && (
            <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-success)', borderLeft: '4px solid var(--fill-success)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-success)', fontWeight: 'bold' }}>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: 'var(--text-success)', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>
          )}
          {errorMsg && (
            <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-warning)', borderLeft: '4px solid var(--fill-warning)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-warning)', fontWeight: 'bold' }}>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: 'var(--text-warning)', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>
          )}

          {/* AI ALERT MOCK */}
          <div style={{ marginBottom: '24px', padding: '12px 16px', background: 'var(--bg-warning)', borderLeft: '4px solid var(--fill-warning)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ color: 'var(--text-warning)', fontSize: '14px' }}>⚠️ AI Anomaly Detected:</strong>
              <span style={{ color: 'var(--text-warning)', fontSize: '13px', marginLeft: '8px' }}>Unusual spike in transactions 2 hours ago.</span>
            </div>
          </div>

          {/* KPI CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 500, margin: 0 }}>Total Revenue</p>
                <span style={{ fontSize: '12px', background: 'var(--bg-success)', color: 'var(--text-success)', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>+24.5%</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 500, margin: '0 0 8px', color: 'var(--text-primary)' }}>${totalRevenue.toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>vs. last month</p>
            </div>

            <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 500, margin: 0 }}>Active Users</p>
                <span style={{ fontSize: '12px', background: 'var(--bg-success)', color: 'var(--text-success)', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>+12.3%</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 500, margin: '0 0 8px', color: 'var(--text-primary)' }}>4,231</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>523 online now</p>
            </div>
          </div>

          {/* CHARTS ROW (Imported Component + Inline Donut) */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            
            {/* 📈 The Revenue Trend (RenderChart) */}
            <div style={{ flex: 2, background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>Revenue Trend</h3>
              </div>
              {/* COMPONENT */}
              <RenderChart transactions={transactions} />
            </div>

            {/* 🍩 The Breakdown Chart (Inline) */}
            <div style={{ flex: 1, background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', marginTop: 0 }}>Revenue Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={dynamicChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                    {dynamicChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface-1)', borderColor: 'var(--border)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--text-primary)' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
          </div>

       <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Add New Transaction</h3>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const amount = e.target.amount.value;
                const description = e.target.description.value;
                const status = e.target.status.value; // Puthu Status Field
                
                if(!amount || !description) return;
                try {
                  await createTransaction({ amount: Number(amount), description, status });
                  const updatedTrans = await getTransactions();
                  setTransactions(updatedTrans); 
                  e.target.reset();
                  setSuccessMsg("Transaction Added!");
                } catch(err) {
                  setErrorMsg("Failed to add transaction");
                }
              }}
              style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}
            >
              <input type="number" name="amount" placeholder="Amount ($)" required style={{ flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}/>
              <input type="text" name="description" placeholder="Description (e.g. Service)" required style={{ flex: 2, minWidth: '150px', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}/>
              
              <select name="status" style={{ flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}>
                <option value="Completed">✅Completed</option>
                <option value="Pending">🔄Pending</option>
                <option value="Failed">❌Failed</option>
              </select>

              <button type="submit" style={{ padding: '10px 20px', background: 'var(--fill-accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                + Add
              </button>
            </form>
          </div>
              
          <div style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>Recent Transactions</h3>
            </div>
            <TransactionTable transactions={transactions} handleDelete={handleDeleteTransaction} />
          </div>

        </div>
      </div>

      {showProfile && (
        <ProfileModal 
          userData={userData} 
          setUserData={setUserData} 
          setShowProfile={setShowProfile} 
          handleLogout={handleLogout} 
          totalClients={transactions.length} 
          totalRevenue={totalRevenue} 
        />
      )}
    </div>
  );
};

export default Dashboard;
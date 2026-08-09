import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RevenueChart from '../components/RevenueChart';
import TransactionTable from '../components/TransactionTable';
import Sidebar from '../components/Sidebar';
import ProfileModal from '../components/ProfileModal';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState({ name: '', email: '' }); 
  const [errorMsg, setErrorMsg] = useState('');
  const [chartType, setChartType] = useState('bar'); 
  
  const [newTx, setNewTx] = useState({ user: '', amount: '', status: 'Completed' });
 
  const [showProfile, setShowProfile] = useState(false);
  
  const totalRevenue = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalClients = transactions.length;

  const navigate = useNavigate();
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setUserData(user);
        }
      } catch (error) {
        console.error("Profile fetch error", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        setErrorMsg('Failed to connect to server.');
      }
    };

    fetchUserProfile();
    fetchTransactions();
  }, [navigate]);

  const handleInputChange = (e) => {
    setNewTx({ ...newTx, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...newTx, amount: Number(newTx.amount) }) 
      });

      if (response.ok) {
        const addedData = await response.json();
        setTransactions([addedData, ...transactions]);
        setNewTx({ user: '', amount: '', status: 'Completed' });
      }
    } catch (error) {
      setErrorMsg('Error adding transaction');
    }
  };

  const handleDelete = async(id) =>{
    if(!window.confirm('Are you Sure ,You want to delete this data?')) return;

    const token = localStorage.getItem('token');

    try{
      const response =  await fetch(`http://localhost:5000/api/transactions/${id}`,{
        method:'Delete',
        headers: {Authorization: `Bearer ${token}`}
      })
      if(response.ok){
        setTransactions(transactions.filter((t)=> t._id!==id));

      }
    }catch(err){
      console.error("Error deleting data");
    }

  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const exportToCSV = () => {
    if(transactions.length === 0) return alert("No data to export!");
    

    const csvRows = [];
    const headers = ['Client Name', 'Amount ($)', 'Status', 'Date'];
    csvRows.push(headers.join(','));

    transactions.forEach(t => {
      const date = new Date(t.createdAt).toLocaleDateString();
      csvRows.push(`${t.user},${t.amount},${t.status},${date}`);
    });

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvData);
    const hiddenLink = document.createElement('a');
    hiddenLink.href = csvUrl;
    hiddenLink.download = 'Dashboard_Data.csv';
    hiddenLink.click();
  };

  const copyPublicLink = () => {
    const link = `${window.location.origin}/public/${userData.id}`;
    navigator.clipboard.writeText(link);
    alert(`Public link copied to clipboard!\n\nLink: ${link}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar
       userData={userData}
       setShowProfile={setShowProfile} 
       handleLogout={handleLogout} 
       exportToCSV={exportToCSV} 
       copyPublicLink={copyPublicLink}
      />
            {/* 🚀 MAIN CONTENT SECTION */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome back, {userData.name}! 👋</h2>
            <p className="text-gray-500 mt-1">Here is what's happening with your projects today.</p>
          </div>

          {errorMsg && <p className="text-red-500 mb-4 bg-red-50 p-4 rounded-lg border border-red-200">{errorMsg}</p>}

          {/* Add Data Form */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-gray-100 mb-8">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Add Transaction</h2>
            <form onSubmit={handleAddTransaction} className="flex flex-col sm:flex-row gap-4">
              <input type="text" name="user" value={newTx.user} onChange={handleInputChange} placeholder="Client/Company Name" required className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" />
              <input type="number" name="amount" value={newTx.amount} onChange={handleInputChange} placeholder="Amount ($)" required className="w-full sm:w-48 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" />
              <select name="status" value={newTx.status} onChange={handleInputChange} className="w-full sm:w-48 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50">
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                Add Data
              </button>
            </form>
          </div>

          {/* Dynamic Chart Section */}
          <RevenueChart 
            transactions={transactions} 
            chartType={chartType} 
            setChartType={setChartType} 
          />
          {/* Table Section */}
          <TransactionTable 
            transactions={transactions} 
            handleDelete={handleDelete} 
          />

        </div>
      </main>
      {showProfile && (
        <ProfileModal 
          userData={userData} 
          setShowProfile={setShowProfile} 
          handleLogout={handleLogout} 
          totalClients={totalClients} 
          totalRevenue={totalRevenue} 
        />
      )}
    </div>
  );
};

export default Dashboard;
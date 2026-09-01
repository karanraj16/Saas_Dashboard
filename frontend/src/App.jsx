import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatWidget from './widgets/chatWidgets';


// 🚀 ChatWidget Import


const App = () => {
  return (
    <Router>
      <div className="relative"> 
        
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes> 
        
        <ChatWidget />

      </div>
    </Router>
  );
};

export default App;
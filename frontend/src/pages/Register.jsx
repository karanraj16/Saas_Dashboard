import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [errorMsg, setErrorMsg] = useState('');

  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMsg('');

    try {
      // Backend-oda /register route-ku request anuppurom
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (error) {
      setErrorMsg('Server is down or not connected.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create an Account 🚀
        </h2>
        
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMsg}
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input 
              type="text" 
              name="name"
              value={name}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md mb-4"
          >
            Sign Up
          </button>
        </form>

        {/* Login Page-ku poga oru link */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
const BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

// 1. User Profile API
export const getUserProfile = async () => {
  const response = await fetch(`${BASE_URL}/users/profile`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Profile fetch failed');
  return response.json();
};

// 2. Get Transactions API
export const getTransactions = async () => {
  const response = await fetch(`${BASE_URL}/transactions`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Transactions fetch failed');
  return response.json();
};

// 3. Add Transaction API
export const createTransaction = async (transactionData) => {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST', 
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) throw new Error('Add transaction failed');
  return response.json();
};

// 4. Delete Transaction API
export const removeTransaction = async (id) => {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Delete transaction failed');
  return response.json(); 
};

// 5. Upload Profile Photo API
export const uploadProfilePhoto = async (file) => {
  const token = localStorage.getItem('token');
  
  const formData = new FormData();
  formData.append('image', file); 

  const response = await fetch(`${BASE_URL}/users/profile/photo`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Photo upload failed');
  return response.json();
};

// 6. Stripe Checkout API
export const createCheckout = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/payments/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Payment initiation failed');
  return response.json();
};
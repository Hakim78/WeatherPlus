// const login = async (email, password) => {
//     if (email === 'test@example.com' && password === 'password') {
//       return { token: 'fake-auth-token-123' };
//     }
//     throw new Error('Invalid credentials');
//   };
  
//   const register = async (email, password, username) => {
//     return { token: 'fake-auth-token-123' };
//   };
  
//   export { login, register };


// services/authService.js
const API_URL = 'http://172.20.10.7:4000/user';

const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const register = async (email, password, username) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password,
        name: username 
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    return { valid: true, user: data };
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false };
  }
};

export { login, register, verifyToken };
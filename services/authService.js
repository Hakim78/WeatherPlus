const login = async (email, password) => {
    if (email === 'test@example.com' && password === 'password') {
      return { token: 'fake-auth-token-123' };
    }
    throw new Error('Invalid credentials');
  };
  
  const register = async (email, password, username) => {
    return { token: 'fake-auth-token-123' };
  };
  
  export { login, register };
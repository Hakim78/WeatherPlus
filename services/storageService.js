import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

const storeToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Token cannot be empty');
    }
    await AsyncStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

const hasToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token !== null;
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
};

export { storeToken, getToken, removeToken, hasToken };
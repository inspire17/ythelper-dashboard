import { createContext, useReducer, useContext, useEffect } from 'react';
import { CONSTANTS } from '../constants/Constants';

// Create Context
const AuthContext = createContext();

// Define Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem(CONSTANTS.TOKEN_KEY, action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case 'LOGOUT':
      localStorage.removeItem(CONSTANTS.TOKEN_KEY);
      localStorage.removeItem('user');
      return { ...state, isAuthenticated: false, user: null, token: null };

    default:
      return state;
  }
};

// Safe JSON parsing function
const getLocalStorageItem = key => {
  try {
    const item = localStorage.getItem(key);
    return item;
  } catch (error) {
    console.error(`Error parsing localStorage item "${key}":`, error);
    return null;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem(CONSTANTS.TOKEN_KEY);
  const storedUser = getLocalStorageItem('user');

  const initialState = {
    isAuthenticated: !!storedToken,
    user: storedUser || null,
    token: storedToken || null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (storedToken && storedUser) {
      dispatch({
        type: 'LOGIN',
        payload: { user: storedUser, token: storedToken },
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

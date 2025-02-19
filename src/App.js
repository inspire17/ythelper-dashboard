import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import VideoDetail from './components/VideoDetails';
import AdminUpload from './components/AdminUploadModal';
import { useAuth } from './context/AuthContext';
import { CONSTANTS } from './constants/Constants';

const PrivateRoute = ({ element }) => {
  const { state } = useAuth();

  return state.isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  const auth = useAuth(); // Ensure we always call this hook at the top level
  const { state, dispatch } = auth;

  useEffect(() => {
    const token = localStorage.getItem(CONSTANTS.TOKEN_KEY);

    if (token) {
      dispatch({ type: 'LOGIN', payload: { token } });
    }
  }, [dispatch]);

  // Handle loading state inside JSX instead of an early return
  return state ? (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />
        <Route path="/video/:id" element={<VideoDetail />} />
        {/* <Route path="/admin-upload" element={<PrivateRoute element={<AdminUpload />} />} /> */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  ) : (
    <div>Loading...</div> // Prevents early return of a hook
  );
};

export default App;

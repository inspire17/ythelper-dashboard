import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { state } = useAuth();

  return (
    <nav>
      {/* <Link to="/">Home</Link> */}
      <Link to="/login">Home</Link>
      {state.isAuthenticated ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;

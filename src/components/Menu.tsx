import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Menu: React.FC = () => {
  const { loggedIn, logOut } = useAuth();

return (
  <nav>
    {loggedIn ? (
      <>
        {/* Itens quando o usuário está logado */}
        <Link to="/profile">Dados do Usuário</Link>
        <br />
        <Link to="/tasks">Tarefas</Link>
        <br />
        <button onClick={logOut}>Logout</button>
      </>
    ) : (
      <>
        {/* Itens quando o usuário não está logado */}
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
      </>
    )}
  </nav>
);

};

export default Menu;

import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/useAuth";
import logo from "../../assets/logo1.png";

function Header() {
  const navigate = useNavigate(); 
  const { user, loading, logout } = useAuth(); 

  const handleLogout = async () => {
    try {
      await logout(); 
      navigate("/"); 

    } catch (err){
      console.error(err.message); 
    }
  }

  return (
    <header className={styles.header}>
      <Link to="/dashboard" >
        <h2>NovaPay</h2>
        <img
          src={logo}
          alt="Logo"
        />
      </Link>
      

      <div className={styles.userSection}>
        <span>{user ? user.name : "Analyst"}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
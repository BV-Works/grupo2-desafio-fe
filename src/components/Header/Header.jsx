import styles from "./Header.module.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/authContext";

function Header() {
  const navigate = useNavigate(); 
  const { user, loading, logout } = useContext(AuthContext); 

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
      <h2>NovaPay</h2>

      <div className={styles.userSection}>
        <span>{user ? user.name : "Analyst"}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
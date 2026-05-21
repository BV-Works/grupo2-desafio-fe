import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <h2>NovaPay</h2>

      <div className={styles.userSection}>
        <span>Analyst</span>
        <button>Logout</button>
      </div>
    </header>
  );
}

export default Header;
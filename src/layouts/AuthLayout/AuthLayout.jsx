import styles from "./AuthLayout.module.css";

function AuthLayout({ children }) {
  return (
    <div className={styles.AuthLayout}>
      {children}
    </div>
  );
}

export default AuthLayout;
import styles from "./CardShell.module.css"; 

function CardShell({ title, className="", children }) {
  return (
    <article className={`${styles.CardShell} ${className}`}>
      <h2 className={styles.title}>{title}</h2>
        {children}
    </article>
  );
}

export default CardShell;
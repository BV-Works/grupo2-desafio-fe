import styles from "./TableShell.module.css"; 

function TableShell({ title, children }) {
  return (
    <section className={styles.TableShell}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.tableWrapper}>
        {children}
      </div>
    </section>
  );
}

export default TableShell;
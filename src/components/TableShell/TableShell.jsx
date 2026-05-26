import styles from "./TableShell.module.css"; 

function TableShell({ title, footer, children }) {
  return (
    <section className={styles.TableShell}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.tableWrapper}>
        {children}
      </div>

      { footer && (
        <div className={styles.footer} >
          {footer}
        </div>
      )}
    </section>
  );
}

export default TableShell;
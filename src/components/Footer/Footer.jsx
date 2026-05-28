import styles from "./Footer.module.css";
export default function Footer() {
    return (
  <footer>
    <div className={styles.Footer}>
      <div>
        <h3>Cybersecurity</h3>
      </div>
      <div>
        <h3>Data Science</h3>
      </div>
      <div>
        <h3>Full Stack</h3>
      </div>
    </div>
  </footer>);
}

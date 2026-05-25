import styles from "./DecisionCard.module.css";

function DecisionCard({ onFraud, onFalsePositive }) {
  return (
    <article className={styles.DecisionCard}>
      <h2>Analyst Decision</h2>

      <div className={styles.actions}>
        <button
          className={styles.dangerButton}
          onClick={onFraud}
        >
          Confirm Fraud
        </button>

        <button
          className={styles.successButton}
          onClick={onFalsePositive}
          // --> calls the function at parent element on user's click
        >
          Allow Transaction
        </button>
      </div>

    </article>

  );
}

export default DecisionCard;
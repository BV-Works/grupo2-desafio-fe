import styles from "./DecisionModal.module.css";

function DecisionModal({ action, transactionId, analyst, onCancel, onConfirm }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Confirm decision</h2>

        <p>
          You are about to mark transaction <strong>#{transactionId}</strong> as:
        </p>

        <p className={styles.action}>{action}</p>

        <p>Analyst: {analyst}</p>

        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>

          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirm decision
          </button>
        </div>
      </div>
    </div>
  );
}

export default DecisionModal;
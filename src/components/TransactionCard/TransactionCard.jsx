import styles from "./TransactionCard.module.css";

function TransactionCard({ transaction }) {
  return (
    <article className={styles.card}>
      <h2>Transaction Details</h2>

      <p><strong>ID:</strong> {transaction.id}</p>
      <p><strong>Amount:</strong> {transaction.amount} €</p>
      <p><strong>Risk:</strong> {Math.round(transaction.riskScore * 100)}%</p>
      <p><strong>Status:</strong> {transaction.reviewStatus}</p>
      <p><strong>Origin:</strong> {transaction.originAccount}</p>
      <p><strong>Destination:</strong> {transaction.destinationAccount}</p>
    </article>
  );
}

export default TransactionCard;
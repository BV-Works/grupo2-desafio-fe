import styles from "./TransactionCard.module.css";
import CardShell from "../CardShell/CardShell";

function TransactionCard({ transaction }) {
  return (
    <CardShell title="Transaction Details" className={styles.card}>

      <p><strong>Amount:</strong> {transaction.amount} €</p>
      <p className={  transaction.riskScore < 0.25 ? styles.lowRisk
                    : transaction.riskScore >= 0.25 && transaction.riskScore < 0.7 ? styles.mediumRisk
                    : styles.highRisk }
      ><strong>Risk:</strong> {Math.round(transaction.riskScore * 100)}%</p>
      <p><strong>Prediction:</strong> {transaction.modelPrediction}</p>
      <p><strong>Status:</strong> {transaction.reviewStatus}</p>
      <p><strong>Origin:</strong> {transaction.originAccount}</p>
      <p><strong>Destination:</strong> {transaction.destinationAccount}</p>

    </CardShell>
  );
}

export default TransactionCard;


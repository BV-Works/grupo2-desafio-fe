import styles from "./PredictionCard.module.css";
import CardShell from "../CardShell/CardShell";

function PredictionCard({ transaction }) {
  return (
    <CardShell title="Model Prediction"  className={styles.card}>

      <div className={styles.chartWrapper}>

      </div>
      <p className={  transaction.modelPrediction === "fraud" ? styles.highRisk
                          : styles.mediumRisk }
      ><strong>Prediction:</strong> {transaction.modelPrediction}</p>

    </CardShell>

  );
}

export default PredictionCard;
import { arc, pie } from "d3";
import styles from "./PredictionCard.module.css";
import CardShell from "../CardShell/CardShell";

function PredictionCard({ transaction }) {
  const rawRiskScore = transaction.risk_score
    ?? transaction.riskScore
    ?? (transaction.prediction?.prob_fraud != null ? transaction.prediction.prob_fraud * 100 : 0);
  const numericRiskScore = Number.isFinite(rawRiskScore) ? rawRiskScore : 0;
  const riskScore = Math.round(Math.min(Math.max(numericRiskScore, 0), 100));

  const chartData = [
    { label: "Risk", value: riskScore },
    { label: "Safe", value: 100 - riskScore },
  ];

  const radius = 100;
  const pieLayout = pie()
    .sort(null)
    .value((item) => item.value)
    .padAngle(0.03);

  const arcGenerator = arc()
    .innerRadius(radius * 0.62)
    .outerRadius(radius)
    .cornerRadius(8);

  const arcs = pieLayout(chartData);
  const riskClass = riskScore < 25
    ? styles.lowRisk
    : riskScore < 70
      ? styles.mediumRisk
      : styles.highRisk;

  return (
    <CardShell title="Model Prediction" className={styles.card}>

      <div className={styles.chartWrapper}>
        <svg
          viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
          className={styles.chart}
          role="img"
          aria-label={`Risk prediction ${riskScore}%`}
        >
          {arcs.map((slice) => (
            <path
              key={slice.data.label}
              className={slice.data.label === "Risk" ? styles.riskSlice : styles.safeSlice}
              d={arcGenerator(slice)}
            />
          ))}
          <text className={styles.chartValue} textAnchor="middle" y="8">
            {riskScore}%
          </text>
        </svg>
      </div>
      <p className={riskClass}><strong>Prediction:</strong> {riskScore}%</p>

    </CardShell>

  );
}

export default PredictionCard;

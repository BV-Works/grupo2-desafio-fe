import styles from "./TransactionsTable.module.css";
import { useNavigate } from "react-router-dom"; 

function TransactionsTable({ transactions }) {
  const navigate = useNavigate(); 
  return (
    <section className={styles.TransactionsTable}>
      <h2>Transactions Queue</h2>
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}
                onClick={() => navigate(`/transactions/${transaction.id}`)}
                className={styles.clickableRow} >
              <td>{transaction.id}</td>
              <td>{new Date(transaction.date).toLocaleString(
                "es-ES", {
                    day: "2-digit", 
                    month: "2-digit", 
                    hour: "2-digit",
                    minute: "2-digit"
                }
              )}</td>
              <td>{transaction.originAccount}</td>
              <td>{transaction.destinationAccount}</td>
              <td>{transaction.amount} €</td>
              <td
                className={ transaction.riskScore < 0.25 ? styles.lowRisk
                            : transaction.riskScore >= 0.25 && transaction.riskScore < 0.7 ? styles.mediumRisk
                            : styles.highRisk
                 } >
                    {Math.round(transaction.riskScore * 100)}%</td>
              <td>{transaction.reviewStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    </section>
  );
}

export default TransactionsTable;
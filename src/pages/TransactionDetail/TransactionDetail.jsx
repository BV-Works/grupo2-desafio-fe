import { useParams, Link } from "react-router-dom";
import transactions from "../../data/mockTransactions.json"; 
import styles from "./TransactionDetail.module.css"; 
import MainLayout from "../../layouts/MainLayout/MainLayout";

function TransactionDetailPage() {
  const { id } = useParams();

  const transaction = transactions.find(transaction => transaction.id === Number(id)); 

  if (!transaction) return <p>Transaction not found</p>

  return (
    <MainLayout >
      <section className={styles.TransactionDetail}>
        <Link to="/dashboard" >... Back to Dashboard</Link>
        <h1>Transaction #{transaction.id}</h1>

        <p>Amount: {transaction.amount} €</p>
        <p>Risk: {Math.round(transaction.riskScore * 100)}%</p>
        <p>Status: {transaction.reviewStatus}</p>
        <p>Origin: {transaction.originAccount}</p>
        <p>Destination: {transaction.destinationAccount}</p>
      </section>
    </MainLayout>
  );
}

export default TransactionDetailPage;
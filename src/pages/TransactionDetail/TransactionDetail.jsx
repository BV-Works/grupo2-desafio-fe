import { useState, useContext } from "react"; 
import { useParams, Link } from "react-router-dom";
import styles from "./TransactionDetail.module.css"; 
import MainLayout from "../../layouts/MainLayout/MainLayout";

import transactions from "../../data/mockTransactions.json"; 
import clients from "../../data/mockClients.json"; 

import TransactionCard from "../../components/TransactionCard/TransactionCard"; 
import ClientCard from "../../components/ClientCard/ClientCard"; 
import DecisionModal from "../../components/DecisionModal/DecisionModal"; 
import PredictionCard from "../../components/PredictionCard/PredictionCard"
import DecisionCard from "../../components/DecisionCard/DecisionCard";

import { AuthContext } from "../../context/authContext"

function TransactionDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext); 

  const [ modalAction, setModalAction ] = useState(null); 
  const [ decision, setDecision ] = useState(null); 

  const transaction = transactions.find(transaction => transaction.id === Number(id)); 
  const client = clients.find(client => client.id_cliente === 2); 

  if (!transaction) return <p>Transaction not found</p>; 
  if (!client) return <p>Client not found</p>; 

  const handleConfirmDecision = () => {
    setDecision({
      action: modalAction, 
      analyst: user?.name, 
      transactionId: transaction.id
    }); 
    setModalAction(null); 
  }

  return (
    <MainLayout >
      <section className={styles.TransactionDetail}>
        <h1>Transaction #{transaction.id}</h1>

        {decision && (
          <p className={styles.decisionMessage}>
            Transaction decision: {decision.action} | Analyst: {decision.analyst}
          </p>
        )}

        <div className={styles.cardsGrid}>
          <TransactionCard transaction={transaction} />
          <ClientCard client={client} />
          <PredictionCard transaction={transaction}/>
        </div>
        
        <DecisionCard onFraud={()=> setModalAction("confirmed_fraud")}
                      onFalsePositive={()=> setModalAction("false_positive")}
                    // use arrow function to pass it's definition
        /> 

      {modalAction && (
        <DecisionModal
          action={modalAction}
          transactionId={transaction.id}
          analyst={user?.email || "Demo analyst"}
          onCancel={() => setModalAction(null)}
          onConfirm={handleConfirmDecision}
        />
      )}
      </section>
    </MainLayout>
  );
}

export default TransactionDetailPage;
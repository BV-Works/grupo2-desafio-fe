import { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom"; // NUEVO: Importar useNavigate
import styles from "./TransactionDetail.module.css"; 
import MainLayout from "../../layouts/MainLayout/MainLayout";

import TransactionCard from "../../components/TransactionCard/TransactionCard"; 
import ClientCard from "../../components/ClientCard/ClientCard"; 
import DecisionModal from "../../components/DecisionModal/DecisionModal"; 
import PredictionCard from "../../components/PredictionCard/PredictionCard"
import DecisionCard from "../../components/DecisionCard/DecisionCard";

import { useAuth } from "../../context/useAuth";
import { getTransactionById, updateTransactionDecision } from "../../services/transactions.service"; 

function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { user } = useAuth(); 

  const [ isLoading, setIsloading ] = useState(false); 
  const [ transactionError, setTransactionError ] = useState(""); 
  const [ transaction, setTransaction ] = useState(null);

  const [ modalAction, setModalAction ] = useState(null); 
  const [ decision, setDecision ] = useState(null); 
  
  // PUT
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ submitError, setSubmitError ] = useState("");

  useEffect(() => {
    async function fetchTransaction() {
      try {
        setIsloading(true); 
        setTransactionError(""); 
        const transaction = await getTransactionById(id); 
        setTransaction(transaction); 
      } catch (err) {
        setTransactionError(err.message)
      } finally {
        setIsloading(false); 
      }
    }
    fetchTransaction(); 
  }, [id]); 

  const handleConfirmDecision = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = {
        target_final: modalAction === "confirmed_fraud", // fraude --> true, false_positive --> false
        id_usuario: user?.id
      };

      await updateTransactionDecision(transaction.id_transaccion, payload);

      // OK --> set decision (success modal)
      setDecision({
        action: modalAction, 
        analyst: user?.name, 
        transactionId: transaction.id_transaccion
      }); 

    } catch (error) {
      console.error("Error al enviar la decisión:", error);
      setSubmitError(error.response?.data?.message || "Hubo un error al guardar la decisión.");
    } finally {
      setIsSubmitting(false);
      setModalAction(null); // Cerramos el primer modal de confirmación
    }
  }

  if (isLoading) return <MainLayout><p>Loading transaction...</p></MainLayout>;
  if (transactionError) return <MainLayout><p>{transactionError}</p></MainLayout>;
  if (!transaction) return <MainLayout><p>Transaction not found</p></MainLayout>;

  return (
    <MainLayout>
      <section className={styles.TransactionDetail}>
        <h1>Transaction #{transaction.id_transaccion}</h1>

        {/* SUCCESS MODAL ( componentizise ) */}
        {decision && (
          <div className={styles.successModalOverlay}>
            <div className={styles.successModalContent}>
              <h2>¡Decisión guardada con éxito!</h2>
              <p>
                La transacción ha sido marcada como: <strong>{decision.action === "confirmed_fraud" ? "Fraude Confirmado" : "Falso Positivo"}</strong>
              </p>
              <button 
                onClick={() => navigate('/dashboard')} // Ajusta la ruta de tu dashboard si es diferente
                className={styles.dashboardBtn}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Show PUT error response */}
        {submitError && <p className={styles.errorMessage}>{submitError}</p>}

        <div className={styles.cardsGrid}>
          <TransactionCard transaction={transaction} />
          <ClientCard transaction={transaction} />
          <PredictionCard transaction={transaction}/>
        </div>
        
        <DecisionCard 
          onFraud={() => setModalAction("confirmed_fraud")}
          onFalsePositive={() => setModalAction("false_positive")}
        /> 

        {modalAction && (
          <DecisionModal
            action={modalAction}
            transactionId={transaction.id_transaccion}
            analyst={user?.email || "Demo analyst"}
            onCancel={() => setModalAction(null)}
            onConfirm={handleConfirmDecision}
            disabled={isSubmitting}
          />
        )}
      </section>
    </MainLayout>
  );
}

export default TransactionDetailPage;
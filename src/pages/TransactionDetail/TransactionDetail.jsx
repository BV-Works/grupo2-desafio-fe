import { useState, useEffect } from "react"; 
import { useParams, Link } from "react-router-dom";
import styles from "./TransactionDetail.module.css"; 
import MainLayout from "../../layouts/MainLayout/MainLayout";

import TransactionCard from "../../components/TransactionCard/TransactionCard"; 
import ClientCard from "../../components/ClientCard/ClientCard"; 
import DecisionModal from "../../components/DecisionModal/DecisionModal"; 
import PredictionCard from "../../components/PredictionCard/PredictionCard"
import DecisionCard from "../../components/DecisionCard/DecisionCard";

import { useAuth } from "../../context/useAuth"
import { getTransactionById } from "../../services/transactions.service";

/* {
  "id_transaccion": "trx-002",
  "id_cliente": "cli-002",
  "id_cuenta": "acc-002",
  "cuenta_origen": "FR20427866183",
  "estado_cuenta": "activa",
  "saldo_actual": 8500,
  "saldo_medio_30_dias": 7900,
  "volumen_entrante_30_dias": 12000,
  "volumen_saliente_30_dias": 9500,
  "numero_transferencias_recibidas_7_dias": 10,
  "numero_transferencias_enviadas_7_dias": 8,
  "id_tarjeta": "card-002",
  "estado_tarjeta": "activa",
  "fecha_creacion_tarjeta": "2022-03-12",
  "antiguedad_tarjeta_dias": 800,
  "limite_importe_transacciones": 5000,
  "veces_superar_limite_7_dias": 1,
  "tipo_transaccion": "transferencia",
  "fecha_hora": null,
  "is_night": true,
  "is_weekend": false,
  "tiempo_desde_ultima_transaccion": 120,
  "numero_transacciones_ultima_hora": 5,
  "importe_transaccion": 3200,
  "metodo_autenticacion": "SMS",
  "numero_pin_disponibles": 2,
  "identificador_dispositivo_fingerprint": "fp-002",
  "dispositivo_reconocido": false,
  "operacion_pais": "DE",
  "operacion_region": "Berlin",
  "direccion_ip_origen": "102.54.22.11",
  "geolocalizacion": "52.5200,13.4050",
  "cuenta_destino": "DE9988776655",
  "destino_alto_riesgo": true,
  "target_final": null,
  "fecha_revision": null,
  "id_usuario": null,
  "prediction": {
      "id_transaccion": "trx-002",
      "is_fraud": true,
      "prob_fraud": 0.91,
      "impacto_fraude": true,
      "es_transfronteriza": true,
      "ratio_imp_limite": 0.64,
      "intensidad_tx": 0.045,
      "severidad_tx": 890,
      "flujo_neto_30d": 2500,
      "mensaje": "Alto riesgo de fraude detectado",
      "createdAt": "2026-05-26T16:58:59.783Z",
      "updatedAt": "2026-05-26T16:58:59.783Z"
  },
  "risk_score": 91
} */

function TransactionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth(); 

  const [ isLoading, setIsloading ] = useState(false); 
  const [ transactionError, setTransactionError ] = useState(""); 
  const [ transaction, setTransaction ] = useState(null);

  const [ modalAction, setModalAction ] = useState(null); 
  const [ decision, setDecision ] = useState(null); 

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
  }, [])

  const handleConfirmDecision = () => {
    setDecision({
      action: modalAction, 
      analyst: user?.name, 
      transactionId: transaction.id_transaccion
    }); 
    setModalAction(null); 
  }

  if (isLoading) {
    return (
      <MainLayout>
        <p>Loading transaction...</p>
      </MainLayout>
    );
  }
  
  if (transactionError) {
    return (
      <MainLayout>
        <p>{transactionError}</p>
      </MainLayout>
    );
  }
  
  if (!transaction) {
    return (
      <MainLayout>
        <p>Transaction not found</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout >
      <section className={styles.TransactionDetail}>
        <h1>Transaction #{transaction.id_transaccion}</h1>

        {decision && (
          <p className={styles.decisionMessage}>
            Transaction decision: {decision.action} | Analyst: {decision.analyst}
          </p>
        )}

        <div className={styles.cardsGrid}>
          <TransactionCard transaction={transaction} />
          <ClientCard transaction={transaction} />
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
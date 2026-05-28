import styles from "./TransactionsTable.module.css";
import { useNavigate } from "react-router-dom"; 
import TableShell from "../TableShell/TableShell"; 

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

function TransactionsTable({ transactions, transactionsPage, onPrev, onNext }) {
  const navigate = useNavigate(); 
  return (
    <TableShell title="Transactions Queue" 
            footer={
              <>
              <button
              disabled={transactionsPage === 1}
              onClick={onPrev}
              >Previous
              </button>

              <span>Page {transactionsPage}</span>

              <button onClick={onNext}>
              Next
              </button>
              </>
            } >
      <table className={styles.TransactionsTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client → Transaction<span>(country)</span></th>
            <th>Auth Method</th>
            <th>Destination <span>Risk</span></th>
            <th>Amount</th>
            <th>Fraud <span>Probability</span></th>
            <th>Usual <span>Device</span></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id_transaccion}
                onClick={() => navigate(`/transactions/${transaction.id_transaccion}`)}
                className={styles.clickableRow} >
              <td>{new Date(transaction.fecha_hora).toLocaleString(
                "es-ES", {
                    day: "2-digit", 
                    month: "2-digit", 
                    hour: "2-digit",
                    minute: "2-digit"
                }
              )} </td>
              <td className={transaction.cuenta_origen.substring(0,2) === transaction.operacion_pais ? styles.lowRisk : styles.highRisk}>{`${transaction.cuenta_origen.substring(0,2)} → ${transaction.operacion_pais}`}</td>
              <td className={transaction.metodo_autenticacion === "SMS" ? styles.lowRisk : styles.highRisk}>{transaction.metodo_autenticacion}</td>
              <td className={transaction.destino_alto_riesgo ? styles.highRisk
                            : styles.lowRisk
              }>{transaction.destino_alto_riesgo ? "High" : "Low"}</td>
              <td>{transaction.importe_transaccion} €</td>
              <td
                className={ transaction.riskScore < 25 ? styles.lowRisk
                            : transaction.riskScore >= 25 && transaction.riskScore < 70 ? styles.mediumRisk
                            : styles.highRisk
                 } >
                    {Math.round(transaction.risk_score)}%</td>
              <td>{transaction.dispositivo_reconocido ? "✔️" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </TableShell>
  );
}

export default TransactionsTable;
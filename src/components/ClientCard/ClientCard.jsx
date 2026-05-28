import styles from "./ClientCard.module.css";
import CardShell from "../CardShell/CardShell";

/* {
  "volumen_entrante_30_dias": 12000,
  "volumen_saliente_30_dias": 9500,
  "numero_transferencias_recibidas_7_dias": 10,
  "numero_transferencias_enviadas_7_dias": 8,
  "estado_tarjeta": "activa",
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

function ClientCard({ transaction }) {
  return (
    <CardShell title="Account Details" className={styles.card}>

      <p><strong>Status:</strong> {transaction.estado_cuenta}</p>
      <p><strong>Balance:</strong> {transaction.saldo_actual}</p>
      <p><strong>Average balance/last 30 days:</strong> {transaction.saldo_medio_30_dias}</p>

      <h2>Card Details</h2>
      <p className={transaction.estado_tarjeta === "activa" ? styles.lowRisk : styles.highRisk}><strong>Status:</strong> {transaction.estado_tarjeta}</p>
      <p><strong>Limit:</strong> {transaction.limite_importe_transacciones}</p>
      <p><strong>Days active:</strong> {transaction.antiguedad_tarjeta_dias}</p>
      <p className={transaction.numero_pin_disponibles === 3 ? styles.lowRisk : transaction.numero_pin_disponibles > 0 ? styles.highRisk : styles.highRisk}><strong>Pin attempts available:</strong> {transaction.numero_pin_disponibles}</p>
      


    </CardShell>

  );
}

export default ClientCard;
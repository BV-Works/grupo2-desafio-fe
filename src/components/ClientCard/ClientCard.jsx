import styles from "./ClientCard.module.css";
import CardShell from "../CardShell/CardShell";

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

function ClientCard({ transaction }) {
  return (
    <CardShell title="Account Details" className={styles.card}>

      <p><strong>State:</strong> {transaction.estado_cuenta}</p>
      <p><strong>Region:</strong> {transaction.estado_cuenta}</p>
      <p><strong>Frauds:</strong> {transaction.estado_cuenta}</p>
      <p><strong>Status:</strong> {transaction.estado_cuenta ? "Active" : "Blocked"}</p>

    </CardShell>

  );
}

export default ClientCard;
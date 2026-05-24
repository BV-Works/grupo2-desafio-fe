import styles from "./ClientCard.module.css";

function ClientCard({ client }) {
  return (
    <article className={styles.card}>
      <h2>Client Details</h2>

      <p><strong>Name:</strong> {client.nombre}</p>
      <p><strong>Email:</strong> {client.correo}</p>
      <p><strong>Country:</strong> {client.pais_residencia}</p>
      <p><strong>Region:</strong> {client.region_residencia}</p>
      <p><strong>Frauds:</strong> {client.num_fraudes}</p>
      <p><strong>Status:</strong> {client.estado ? "Active" : "Blocked"}</p>
    </article>
  );
}

export default ClientCard;
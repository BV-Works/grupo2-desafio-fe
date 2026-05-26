import styles from "./ClientCard.module.css";
import CardShell from "../CardShell/CardShell";

function ClientCard({ client }) {
  return (
    <CardShell title="Client Details">

      <p><strong>Country:</strong> {client.pais_residencia}</p>
      <p><strong>Region:</strong> {client.region_residencia}</p>
      <p><strong>Frauds:</strong> {client.num_fraudes}</p>
      <p><strong>Status:</strong> {client.estado ? "Active" : "Blocked"}</p>

    </CardShell>

  );
}

export default ClientCard;
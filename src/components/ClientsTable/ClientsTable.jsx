import styles from "./ClientsTable.module.css"; 
import TableShell from "../TableShell/TableShell";


// {
//   "id_cliente": "cli-001",
//   "tipo_cliente": "persona",
//   "edad_cliente": 35,
//   "customer_country": "ES",
//   "customer_region": "Centro",
//   "tenure": 365,
//   "importe_medio_mensual": 500,
//   "desviacion_estandar_mensual": 150,
//   "media_transacciones_al_dia": 3.5,
//   "numero_fraudes_ultimo_ano": 0,
//   "count": 1,
//   "risk_score": 31.75
// }

function ClientsTable({ clients, clientsPage, onPrev, onNext }) {
  return (
    <TableShell title="High Risk Clients" 
    footer={
      <>
      <button
      disabled={clientsPage === 1}
      onClick={onPrev}
      >Previous
      </button>

      <span>Page {clientsPage}</span>

      <button onClick={onNext}>
      Next
      </button>
      </>
    }>
      <table className={styles.ClientsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fraud cases <span>(last year)</span></th>
            <th>Risk score</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id_cliente}>
                <td>{client.id_cliente}</td>
                <td>{client.numero_fraudes_ultimo_ano}</td>
                <td>{(Number(client.risk_score)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </TableShell>
  );
}

export default ClientsTable;
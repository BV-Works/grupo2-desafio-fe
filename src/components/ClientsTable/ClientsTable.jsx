import styles from "./ClientsTable.module.css"; 
import TableShell from "../TableShell/TableShell";

function ClientsTable({ clients }) {
  return (
    <TableShell title="Related Clients" >
      <table className={styles.ClientsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fraud cases</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id_cliente}>
                <td>{client.id_cliente}</td>
                <td>{client.num_fraudes}</td>
                <td>{client.estado ? "ACTIVO" : "BLOQUEADO"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </TableShell>
  );
}

export default ClientsTable;
import styles from "./ClientsTable.module.css"; 

function ClientsTable({ clients }) {
  return (
    <section className={styles.ClientsTable}>
      <h2>Related Clients</h2>
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
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

    </div>
    </section>
  );
}

export default ClientsTable;
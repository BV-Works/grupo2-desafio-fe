import MainLayout from "../../layouts/MainLayout/MainLayout"
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable"
import transactions from "../../data/mockTransactions.json"
import ClientsTable from "../../components/ClientsTable/ClientsTable"
import clients from "../../data/mockClients.json"
import styles from "./DashboardPage.module.css"
export default function DashboardPage () {
    const pendingTransactions = transactions.filter(transaction => transaction.reviewStatus === "pending"); 
    const fraudClients = clients.filter(client => client.num_fraudes > 0); 
    return (
        <MainLayout>
        <main className={styles.DashboardPage}>
            <h1>Dashboard</h1>
            <div className={styles.tablesWrapper}>
                    <TransactionsTable transactions={pendingTransactions} />
                    <ClientsTable clients={fraudClients} />
            </div>
        </main>
        </MainLayout>
    )
}
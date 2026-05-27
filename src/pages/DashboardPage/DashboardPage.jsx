import MainLayout from "../../layouts/MainLayout/MainLayout"
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable"
import ClientsTable from "../../components/ClientsTable/ClientsTable"
import BooleanBarChart from "../../components/BooleanBarChart/BooleanBarChart"
import BooleanDonutChart from "../../components/BooleanDonutChart/BooleanDonutChart"
import FraudPredictionsChart from "../../components/FraudPredictionsChart/FraudPredictionsChart"
import transactions from "../../data/mockTransactions.json"
import clients from "../../data/mockClients.json"
import transaccionesMock from "../../data/transaccionesMock.json"
import predicciones from "../../data/predicciones_aplanadas.json"

import styles from "./DashboardPage.module.css"

export default function DashboardPage() {
    const pendingTransactions = transactions.filter(transaction => transaction.reviewStatus === "pending");
    const fraudClients = clients.filter(client => client.num_fraudes > 0);

    const nightTransactions = transaccionesMock.filter(transaction => transaction.is_night).length;
    const dayTransactions = transaccionesMock.filter(transaction => !transaction.is_night).length;

    const weekendTransactions = transaccionesMock.filter(transaction => transaction.is_weekend).length;
    const weekdayTransactions = transaccionesMock.filter(transaction => !transaction.is_weekend).length;

    const nightChartData = [
        { label: "Noche", value: nightTransactions },
        { label: "Día", value: dayTransactions }
    ];

    const weekendChartData = [
        { label: "Fin de semana", value: weekendTransactions },
        { label: "Entre semana", value: weekdayTransactions }
    ];

    return (
        <MainLayout>
            <main className={styles.DashboardPage}>
                <h1>Dashboard</h1>

                <div className={styles.tablesWrapper}>
                    <TransactionsTable transactions={pendingTransactions} />
                    <ClientsTable clients={fraudClients} />
                </div>

                <div className={styles.chartsWrapper}>
                    <BooleanBarChart
                        title="Transacciones por horario"
                        data={nightChartData}
                    />

                    <BooleanDonutChart
                        title="Transacciones por día"
                        data={weekendChartData}
                    />
                </div>

                <FraudPredictionsChart predictions={predicciones} />
            </main>
        </MainLayout>
    )
}

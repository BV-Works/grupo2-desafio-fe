// Carga clientes de alto riesgo. Carga transacciones de alto riesgo. Carga transacciones para calcular métricas/gráficas

import { useState, useEffect } from "react"; 
import MainLayout from "../../layouts/MainLayout/MainLayout";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import ClientsTable from "../../components/ClientsTable/ClientsTable";
import FraudMetrics from "../../components/FraudMetrics/FraudMetrics";
import { getHighRiskClients } from "../../services/client.service";
import { getHighRiskTransactions, getTransactions } from "../../services/transactions.service"; // getHighRiskTransactions -> Para la tabla de transacciones. getTransactions -> Para traer transacciones más genéricas, en este caso para métricas

import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
    const [clients, setClients] = useState([]); 
    const [clientsPage, setClientsPage] = useState(1); 
    const [clientsLoading, setClientsLoading] = useState(false); 
    const [clientsError, setClientsError] = useState(""); 

    const [transactions, setTransactions] = useState([]); 
    const [transactionsPage, setTransactionsPage] = useState(1); 
    const [transactionsLoading, setTransactionsLoading] = useState(false); 
    const [transactionsError, setTransactionsError] = useState(""); 

    const [metricTransactions, setMetricTransactions] = useState([]); // Guarda las transacciones que se usarán para las gráficas (La tabla trae 10 por página)
    const [metricsLoading, setMetricsLoading] = useState(false); // Indica si las métricas están cargando
    const [metricsError, setMetricsError] = useState(""); // Guarda errores al cargar las métricas

    useEffect(() => {
        async function fetchClients() {
            try {
                setClientsLoading(true); 
                setClientsError(""); 

                const res = await getHighRiskClients(clientsPage, 10); 

                setClients(res.data); 
            } catch (err) {
                setClientsError(err.message); 
            } finally {
                setClientsLoading(false); 
            }
        }

        fetchClients(); 
    }, [clientsPage]); 

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setTransactionsLoading(true); 
                setTransactionsError(""); 

                const res = await getHighRiskTransactions(transactionsPage, 10); // Eso rellena la tabla de transacciones

                setTransactions(res.data); 
            } catch (err) {
                console.error(err);
                setTransactionsError(err.message); 
            } finally {
                setTransactionsLoading(false); 
            }
        };

        fetchTransactions(); 
    }, [transactionsPage]); 

    useEffect(() => {
        const fetchMetricTransactions = async () => {
            try {
                setMetricsLoading(true);
                setMetricsError("");
                // Eso trae las transacciones de alto riesgo para calcular las cards
                const res = await getTransactions({
                    page: 1,
                    limit: 2000,
                    riskLevel: "high",
                    target_final: false,
                    sort: "prob_fraud_desc",
                });

                setMetricTransactions(res.data ?? []); // Guarda las transacciones de métricas -> Si res.data es null o undefined, usa un array vacío. Evita que la app rompa
            } catch (err) {
                console.error(err);
                setMetricsError(err.message);
            } finally {
                setMetricsLoading(false); // Desactiva loading
            }
        };

        fetchMetricTransactions();
    }, []);

    return (
        <MainLayout>
            <main className={styles.DashboardPage}>
                <h1>Dashboard</h1>

                <section id="tables">
                    <div className={styles.tablesWrapper}>
                        <TransactionsTable
                            transactions={transactions}
                            transactionsPage={transactionsPage}
                            onPrev={() => setTransactionsPage((page) => page - 1)}
                            onNext={() => setTransactionsPage((page) => page + 1)}
                        />

                        {clientsLoading && <p>Loading clients...</p>}
                        {clientsError && <p>{clientsError}</p>}
                        {transactionsLoading && <p>Loading transactions...</p>}
                        {transactionsError && <p>{transactionsError}</p>}

                        <ClientsTable
                            clients={clients}
                            clientsPage={clientsPage}
                            onPrev={() => setClientsPage((page) => page - 1)}
                            onNext={() => setClientsPage((page) => page + 1)}
                        />
                    </div>
                </section>

                <section id="metrics">
                    <h2>Metrics</h2>
                    <FraudMetrics
                        transactions={metricTransactions} // pasa las transacciones usadas para calcular las gráficas
                        isLoading={metricsLoading}
                        error={metricsError}
                    />
                </section>
            </main>
        </MainLayout>
    );
}

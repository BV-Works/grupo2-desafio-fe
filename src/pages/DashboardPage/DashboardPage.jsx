import { useState, useEffect } from "react"; 
import MainLayout from "../../layouts/MainLayout/MainLayout";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import ClientsTable from "../../components/ClientsTable/ClientsTable";
import BooleanBarChart from "../../components/BooleanBarChart/BooleanBarChart";
import BooleanDonutChart from "../../components/BooleanDonutChart/BooleanDonutChart";
import transactions from "../../data/mockTransactions.json";
import { getHighRiskClients } from "../../services/client.service";
import { getHighRiskTransactions } from "../../services/transactions.service"; 
import transaccionesMock from "../../data/transaccionesMock.json";

import styles from "./DashboardPage.module.css"

export default function DashboardPage() {

    // Clients API fetch::
    const [ clients, setClients ] = useState([]); 
    const [ clientsPage, setClientsPage ] = useState(1); 
    const [ clientsTotal, setClientsTotal ] = useState(null); 
    const [ clientsLoading, setClientsLoading ] = useState(false); 
    const [ clientsError, setClientsError ] = useState(""); 

    useEffect (() => {
        async function fetchClients() {
            try {
                setClientsLoading(true); 
                setClientsError(""); 

                const res = await getHighRiskClients( clientsPage, 10 ); 

                setClients(res.data); 
                setClientsTotal(res.total); 
            } catch (err) {
                setClientsError(err.message); 

            } finally {
                setClientsLoading(false); 
            }
        }
        fetchClients(); 

    }, [ clientsPage ]) 

    // Transactions API fetch

    const [ transactions, setTransactions ] = useState([]); 
    const [ transactionsPage, setTransactionsPage ] = useState(1); 
    const [ transactionsTotal, setTransactionsTotal ] = useState(0); 
    const [ transactionsLoading, setTransactionsLoading ] = useState(false); 
    const [ transactionsError, setTransactionsError ] = useState(""); 


    useEffect (() => {
        const fetchTransactions = async () => {
            try {
                setTransactionsLoading(true); 
                setTransactionsError(""); 

                const res = await getHighRiskTransactions(transactionsPage, 10); 

                setTransactions(res.data); 
                setTransactionsTotal(res.total); 
            } catch (err) {
                console.error(err)
                setTransactionsError(err.message); 

            } finally {
                setTransactionsLoading(false); 
            }
        }
        fetchTransactions(); 
    }, [ transactionsPage ]); 

/*     const handleClientFilterChange = (event) => {
        const { name, value } = event.target; 

        setClientsPage(1); 

        setClientFilters((prevFilters) => ({
            ...prevFilters, 
            [name]: value, 
        })); 
    };  */

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
                <section id="tables">
                    <div className={styles.tablesWrapper}>
                        <TransactionsTable transactions={transactions}
                                            transactionsPage={ transactionsPage }
                                            onPrev={() => setTransactionsPage((page) => page - 1)}
                                            onNext={() => setTransactionsPage((page) => page + 1)} />


                        {clientsLoading && <p>Loading clients...</p>}
                        {clientsError && <p>{clientsError}</p>}

                        <ClientsTable clients={clients}
                                        clientsPage={clientsPage}
                                        onPrev={() => setClientsPage((page) => page - 1)}
                                        onNext={() => setClientsPage((page) => page + 1)} />

                    </div>
                </section>

                <section id="metrics">
                    <h2>Metrics</h2>
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
                </section>
                
            </main>
        </MainLayout>
    )
}

import apiClient from "../api/client";

export async function getHighRiskTransactions(page = 1, limit = 10) {
    const response = await apiClient.get("/transactions", { 
        params: {
            page, 
            limit, 
            riskLevel: "high", 
            target_final: false, 
            sort: "prob_fraud_desc"
        } }); 
    return response.data; 
}; 

export async function getTransactionById(id) {
    const response = await apiClient.get(`/transactions/${id}`); 
    return response.data; 
}; 
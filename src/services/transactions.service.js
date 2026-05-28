import apiClient from "../api/client";

export async function getTransactions(params = {}) { // params = {} si no le pasas nada, usará un objeto vacío
    const response = await apiClient.get("/transactions", { params }); // { params } -> convierte el objeto en query params -> /api/transactions?page=1&limit=10
    return response.data; // Devuelve solo los datos que manda el backend gracias a axios
};

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

export const updateTransactionDecision = async (id, payload) => {
    const response = await apiClient.put(`/transactions/${id}`, payload);
    return response.data;
};

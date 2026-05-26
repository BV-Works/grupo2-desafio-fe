import apiClient from "../api/client";

export async function getHighRiskClients(page = 1, limit = 10) {
    const response = await apiClient.get("/clients", { 
        params: {
            page, 
            limit, 
            riskLevel: "high"
        } }); 
    return response.data; 
}; 

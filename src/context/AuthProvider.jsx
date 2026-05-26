import { useEffect, useState } from "react"; 
import { authContext as AuthContext } from "./authContext";
import { login as loginService, getUser, logout as logoutService } from "../services/auth.service"; 

export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null); 
    const [ error, setError ] = useState(""); 
    const [ loading, setLoading ] = useState(true); 

    const fetchUser = async () => {

        try {
            const data = await getUser(); 
            
            setUser(data.user);  

        } catch (err) {
            setUser(null); 
        } finally {
            setLoading(false); 
        }
    }; 
    useEffect(() => {
        fetchUser(); 
    }, []); 

   

    const login = async (credentials) => {
        setError(""); 

        try {
            const data = await loginService(credentials); 

            setUser(data.user); 

            return data; 

        } catch (err) {
            const message = err.response?.data?.message || "Login failed"; 
            setError( message ); 
            throw new Error(message); 
        }
    }; 

    const logout = async () => {
        try {
            await logoutService(); 

            setUser(null); 

        } catch (err) {
            const message = err.response?.data?.message || "Logout failed"; 
            setError( message ); 
            throw new Error(message); 
        }
    }; 

    return (
        <AuthContext.Provider
          value={{
            user,
            error,
            loading,
            setError,
            login,
            logout,
            fetchUser
          }}
        >
          {children}
        </AuthContext.Provider>
      ); 
}
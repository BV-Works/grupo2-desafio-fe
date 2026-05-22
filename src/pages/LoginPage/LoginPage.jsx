import { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom"; 

import { AuthContext } from "../../context/authContext"
import { validateEmail, validatePassword } from "../../utils/regex";
import styles from "./LoginPage.module.css"; 
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";

export default function LoginPage () {
    const navigate = useNavigate(); 
    const { login } = useContext(AuthContext); 

    const [ formData, setFormData ] = useState({ email: "", password: "" }); 

    const [ error, setError ] = useState(""); 

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [ event.target.name ]: event.target.value
        }); 
    }; 

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        
        setError(""); 

        if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
            setError("Formato de email o password inválido"); 
        }

        try {
            await login(formData); 

            navigate("/dashboard"); 

        } catch (err) {
            setError( err.message || "Login failed"); 
        }

    }; 
    return (
        <AuthLayout >
        <main className={styles.LoginPage}>
            <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange} 
                />

                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={formData.password} 
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.center}><button type="submit">Login</button></div>

                </form>
            
        {error && <p className={styles.error}>{ error }</p>}

        </main>
        </AuthLayout>
    ); 
}; 
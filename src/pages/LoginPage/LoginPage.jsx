import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 

import { useAuth } from "../../context/useAuth"; 
import { validateEmail, validatePassword } from "../../utils/regex";
import styles from "./LoginPage.module.css"; 
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import logo from "../../assets/logo1.png";
export default function LoginPage () {
    const navigate = useNavigate(); 
    const { login } = useAuth(); 

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
            return setError("Formato de email o password inválido"); 
        }

        try {
            await login(formData); 

            navigate("/dashboard"); 

        } catch (err) {
            setError( err.message || "Login failed"); 
        }

    }; 
    return (
        <AuthLayout>
            <main className={styles.LoginPage}>
                
                <div className={styles.card}>

                    <div className={styles.logoWrapper}>
                        <img
                            src={logo}
                            alt="Logo"
                            className={styles.logo}
                        />
                    </div>

                    <h1 className={styles.title}>Login</h1>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        
                        <div className={styles.field}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className={styles.button}>
                            Login
                        </button>

                        {error && <p className={styles.error}>{error}</p>}
                    </form>

                </div>

            </main>
        </AuthLayout>
    ); 
}; 
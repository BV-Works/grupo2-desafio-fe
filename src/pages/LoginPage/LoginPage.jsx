import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 

import styles from "./LoginPage.module.css"; 
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";

export default function LoginPage () {
    const navigate = useNavigate(); 

    const [ formData, setFormData ] = useState({ mail: "", pass: "" }); 

    const [ error, setError ] = useState(""); 

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [ event.target.name ]: event.target.value
        }); 
    }; 

    const handleSubmit = (event) => {
        event.preventDefault(); 
        
        setError(""); 

        if (formData.mail === "john@doe.com" && formData.pass === "1234") {
            navigate("/dashboard"); 
        }
        setError("Login failed"); 

    }; 
    return (
        <AuthLayout >
        <main className={styles.LoginPage}>
            <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="mail">Email: </label>
                    <input type="email"
                        name="mail"
                        id="mail"
                        placeholder="Email"
                        value={formData.mail}
                        onChange={handleChange} 
                />

                </div>

                <div>
                    <label htmlFor="pass">Password: </label>
                    <input type="password"
                        name="pass"
                        id="pass"
                        placeholder="Password"
                        value={formData.pass} 
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.center}><button type="submit">Login</button></div>

                </form>
            
        {error && <p className={styles.error}>{ error }</p>}

        </main>
        </AuthLayout>
    ); 
}
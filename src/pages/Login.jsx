import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authorization/AuthContext';
import { API_URL } from '../config/constants';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const {login} = useAuth();

    async function handleLogin(e){
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch(`${API_URL}/auth/login`, {
            
        })
    }
    
  return (
    <div>Please Login First</div>
  )
}

export default Login
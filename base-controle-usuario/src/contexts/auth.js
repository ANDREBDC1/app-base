import React, { createContext, useState, useEffect } from "react";
import { login } from "../api/authApi"
import { saveTokens, clearTokens, obterMensagemErro } from "../api/apiService"

export const AuthContext = createContext({});


export default function AuthProvider({ children }) {

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);

    async function signIn(email, password) {
        try {
            setLoadingAuth(true)
            const token = await login(email, password);

            if (token) {
                saveTokens(token.access_token)
                setToken(token.access_token);
            }

            setLoadingAuth(false)

        } catch (error) {

            const mensagem = obterMensagemErro(error)
            alert("Erro no login " + `${mensagem}`);

        } finally {

            setLoadingAuth(false)
        }
    }

    async function singOut() {
        try {
            await clearTokens();
            setToken(null);
        } catch (erro) {
            setToken(null);
        }
    }

    return (
        <AuthContext.Provider value={{ singned: !!token, token: token, loadingAuth, loading, signIn, singOut }}>
            {children}
        </AuthContext.Provider>
    )

}
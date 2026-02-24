import React, { createContext, useState, useEffect } from "react";
import { login } from "../api/authApi"
import { saveTokens, clearTokens, obterMensagemErro } from "../api/apiService"

export const AuthContext = createContext({});


export default function AuthProvider({ children }) {

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [user, setUser] = useState(null);

    async function signIn(email, password) {
        try {
            setLoadingAuth(true)
            const data = await login(email, password);

            if (data && data.access_token) {
                saveTokens(data.access_token)
                setToken(data.access_token);
                setUser(data.user);
            }

            setLoadingAuth(false)

        } catch (error) {

            const mensagem = obterMensagemErro(error)
            alert("Erro no login " + `${mensagem}`);

        } finally {

            setLoadingAuth(false)
        }
    }

    async function signOut() {
        try {
            await clearTokens();
            setToken(null);
            setUser(null);
        } catch (erro) {
            setToken(null);
        }
    }

    return (
        <AuthContext.Provider value={{ signed: !!token, token: token, loadingAuth, loading, signIn, signOut, user }}>
            {children}
        </AuthContext.Provider>
    )

}
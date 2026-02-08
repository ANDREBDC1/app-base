import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({});


export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);

    useEffect(() => {

        async function loadUser() {

            const data = await AsyncStorage.getItem('auth_user');
            if(data){
                setUser(JSON.parse(data));
            }
            setLoading(false)

        }

        loadUser();

    }, [])

    async function signIn(email, password) {
        try {
            setLoadingAuth(true)
            const user = await auth().signInWithEmailAndPassword(email, password);

            await firestore().collection('users').doc(user.user.uid).onSnapshot(async querySnapshot => {
                
                let data = {
                    ...querySnapshot.data(),
                    email: user.user.email,
                    uid: querySnapshot.id,
                }

                await storageUser(data)
                setLoadingAuth(false)
            });

        } catch (error) {
            alert("Erro no login " + error);

        }

        setLoadingAuth(false)
    }

    async function signUp(name, email, password) {
        try {
            setLoadingAuth(true)
            const user = await auth().createUserWithEmailAndPassword(email, password);
            const data = {
                uid: user.user.uid,
                email: email,
                name
            }
            await firestore().collection('users').doc(user.user.uid).set({
                name,
            });
            setUser(data);
            await storageUser(data)
           
            setLoadingAuth(false)
        } catch (error) {
            alert("Erro no login " + error);

        }

        setLoadingAuth(false)
    }

    async function storageUser(data) {
        setUser(data);
        await AsyncStorage.setItem("auth_user", JSON.stringify(data));
        
    } 

    async function singOut() {
        try {
            await auth().signOut();
            await AsyncStorage.clear();
            setUser(null);
        } catch (erro) {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ singned: !!user, user, loadingAuth, loading, signIn, signUp, singOut, storageUser }}>
            {children}
        </AuthContext.Provider>
    )

}
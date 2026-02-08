import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import { AuthContext } from '../contexts/auth';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

export default function Routes() {

    const {singned, loading} = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ 
                flex: 1, 
                alignContent: 'center', 
                justifyContent: 'center', 
                opacity: 0 
            }}>
                <ActivityIndicator size={50} color="#e52246" />
                
            </View>
        );
    }

    return (
        singned ? <AppRoutes /> : <AuthRoutes />
    );
}

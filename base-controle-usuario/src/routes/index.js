import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import { AuthContext } from '../contexts/auth';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

export default function Routes() {

    const { signed } = useContext(AuthContext);

    //return <AppRoutes />;

    return (
        signed ? <AppRoutes /> : <AuthRoutes />
    );
}

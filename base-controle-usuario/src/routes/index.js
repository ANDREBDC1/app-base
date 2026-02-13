import React, {useContext} from 'react';
import {View, ActivityIndicator} from 'react-native';
import { AuthContext } from '../contexts/auth';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

export default function Routes() {

    const { singned } = useContext(AuthContext);

    return <AppRoutes />;

    return (
        singned ? <AppRoutes /> : <AuthRoutes />
    );
}

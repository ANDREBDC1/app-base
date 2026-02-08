import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer} from '@react-navigation/native'
import Routes from './src/routes'
import AuthProvider from './src/contexts/auth';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" hidden={true}  translucent={false} backgroundColor='#36393F'/>
        <Routes/>
      </NavigationContainer>
    </AuthProvider>
  );
}

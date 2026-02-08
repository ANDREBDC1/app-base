import { createStackNavigator } from '@react-navigation/stack'
import Login  from '../pages/Login'

export default function AuthRoutes() {

  const Stack =  createStackNavigator()
 return (
   <Stack.Navigator>
      <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
   </Stack.Navigator>
  );
}
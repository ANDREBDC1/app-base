import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import Ionicons from "@expo/vector-icons/Ionicons"
import Home from '../pages/Home';

export default function AppRoutes() {
  const Tab = createBottomTabNavigator()
  const Stack = createStackNavigator()

  function StackScreen(){

    return(
      <Stack.Navigator
        screenOptions={{
        }}
      >
        <Stack.Screen 
          name='Home' 
          component={Home} 
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    )

  }

  return (
    <Tab.Navigator 
      
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle:{
          backgroundColor: '#0a0347',
          borderTopWidth: 0,
          paddingTop: 10
        
        },
      
    }}>
      <Tab.Screen 
        name='HomeStack' 
        options={{ tabBarIcon: ({color, size, focused}) => {
          return <Ionicons name={ focused ? 'home' : 'home-outline' } size={size} color={color}/>
          
        }}} 
        component={StackScreen} 
      />
     
    </Tab.Navigator>
  );
}
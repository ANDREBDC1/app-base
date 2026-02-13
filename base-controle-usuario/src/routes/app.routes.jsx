import { createStackNavigator } from '@react-navigation/stack'
import Ionicons from "@expo/vector-icons/Ionicons"
import Home from '../pages/Home';
import { 
  createDrawerNavigator,  
  DrawerContentScrollView, 
  DrawerItemList 
} from '@react-navigation/drawer';

import HeaderMenu from '../components/HeaderMenu';

export default function AppRoutes() {
  //const Tab = createBottomTabNavigator()
  const Stack = createStackNavigator()

   const Drawer = createDrawerNavigator();

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

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      
      {/* 🔹 TÍTULO DA PRIMEIRA SEÇÃO */}
      <HeaderMenu/>

      <DrawerItemList {...props} />

      {/* 🔹 OUTRA SEÇÃO */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>ADMINISTRAÇÃO</Text>
      </View> */}

    </DrawerContentScrollView>
  );
}

  return (
   

    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={
      {
        
        headerTitleAlign: 'center',
        headerTintColor: '#7495c7',
        drawerItemStyle: {
          borderRadius: 12
        }
        
      }
    }>
      <Drawer.Screen name="Home"  component={Home} />
    </Drawer.Navigator>

  );

  // return (
  //   <Tab.Navigator 
      
  //     screenOptions={{
  //       tabBarShowLabel: false,
  //       headerShown: false,
  //       tabBarHideOnKeyboard: true,
  //       tabBarStyle:{
  //         backgroundColor: '#0a0347',
  //         borderTopWidth: 0,
  //         paddingTop: 10
        
  //       },
      
  //   }}>
  //     <Tab.Screen 
  //       name='HomeStack' 
  //       options={{ tabBarIcon: ({color, size, focused}) => {
  //         return <Ionicons name={ focused ? 'home' : 'home-outline' } size={size} color={color}/>
          
  //       }}} 
  //       component={StackScreen} 
  //     />
     
  //   </Tab.Navigator>
  // );
}
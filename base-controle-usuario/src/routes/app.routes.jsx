import { createStackNavigator } from '@react-navigation/stack'
import Home from '../pages/Home';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';

import HeaderMenu from '../components/HeaderMenu';
import EditUser from '../pages/EditUser';


export default function AppRoutes() {
  
  const Stack = createStackNavigator()
  const Drawer = createDrawerNavigator();

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>

        {/* 🔹 TÍTULO DA PRIMEIRA SEÇÃO */}
        <HeaderMenu />

        <DrawerItemList {...props} />

        {/* 🔹 OUTRA SEÇÃO */}

      </DrawerContentScrollView>
    );
  }

  function DrawerRoutes() {
    return (<Drawer.Navigator
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
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>);

  }
  return (
    <Stack.Navigator
      screenOptions={{
      }}
    >
      <Stack.Screen
        name='Home'
        component={DrawerRoutes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        
        name='EditUser'
        component={EditUser}
      />
    </Stack.Navigator>

  );
}
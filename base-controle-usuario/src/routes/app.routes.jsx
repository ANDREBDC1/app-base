
import React, { useContext } from 'react';
import { TouchableOpacity, Text, View} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import Home from '../pages/Home';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';

import HeaderMenu from '../components/HeaderMenu';
import EditUser from '../pages/EditUser';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthContext } from '../contexts/auth';



export default function AppRoutes() {
  
 const { signOut} = useContext(AuthContext);
  const Drawer = createDrawerNavigator();

  function CustomDrawerContent(props) {
    return (

      <View style={{ flex: 1, paddingTop: 20 }}>
        <DrawerContentScrollView {...props}>

          {/* 🔹 TÍTULO DA PRIMEIRA SEÇÃO */}
          <HeaderMenu />

          <DrawerItemList {...props} />

          {/* 🔹 OUTRA SEÇÃO */}

        </DrawerContentScrollView>
        <TouchableOpacity 
          onPress={() => signOut() }
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'row',
            padding: 20,
            borderTopWidth: 1,  
            borderTopColor: '#ccc'
          }}>
          <Text style={{ marginLeft: 10, color: '#ff0000', fontSize: 16, marginRight: 10 }}>Sair</Text>
          <MaterialIcons name="logout" size={24} color="#ff0000" />
        </TouchableOpacity>
      </View>
    );
  }

function HomeStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{
      headerTitleAlign: 'center',
      headerTintColor: '#7495c7',
    }}>
       <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          title: 'Home',
          headerLeft: () => (
            <MaterialIcons
              name="menu"
              color="#7495c7"
              size={28}
              style={{ marginLeft: 15 }}
              onPress={() => navigation.getParent()?.openDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen 
        name="EditUser" 
        component={EditUser}
      />
    </Stack.Navigator>
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
      <Drawer.Screen
        name="Main"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="EditUser" 
        options={{
          title: "Novo Usuário"
        }}
        component={EditUser}
      />
    </Drawer.Navigator>

  );
}
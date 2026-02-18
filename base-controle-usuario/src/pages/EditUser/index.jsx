
import React, { useState, useContext, useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, Text, Keyboard, KeyboardAvoidingView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useNavigation } from '@react-navigation/native';

import {
  Container,
  AreaInput,
  SubimitButton,
  SubimitText,
  EditaPasswordButton
} from './styles'


import Input from '../../components/Input';
import { Name } from '../../components/UserList/styles';

export default function EditUser({ route }) {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
      if (route.params) {
        setNome(route.params.name);
        setEmail(route.params.email);
      }

      navigation.setOptions({
        title: nome ? `Editar Usuário` : 'Novo Usuário',
      });

  }, []);


  function handleEditUser() {
    if (nome === '' || email === '') {
      alert('Preencha todos os campos!');
      return;
    }
    setLoadingAuth(true);

    setTimeout(() => {
      setLoadingAuth(false);
      alert('Usuário editado com sucesso!');
      Keyboard.dismiss();
    }, 2000);
  }

return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <Container>
        <AreaInput>
          <Input
            keyboardType=''
            placeholder='Nome'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => setNome(text)}
            value={nome}
            icone={ <MaterialIcons name="person" size={24} color="#5c5c5c" /> }
            
          />
        </AreaInput>
        <AreaInput>
          <Input
            keyboardType='email-address'
            style={{ width: "90%" }}
            placeholder='Email'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => setEmail(text)}
            value={email}
            icone={ <MaterialIcons name="email" size={24} color="#5c5c5c" /> }

          />
        </AreaInput>
        <AreaInput>
          <Input
            editable={editingPassword}
            style={{ width: "90%" }}
            placeholder='Nova Senha'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            icone={ <MaterialIcons name="lock" size={24} color="#5c5c5c" /> }
          />
          <EditaPasswordButton onPress={() => setEditingPassword(!editingPassword) }>
            <MaterialIcons name="edit" size={24} color="#ffffff" />
          </EditaPasswordButton>
        </AreaInput>
        <SubimitButton onPress={handleEditUser}>
          {loadingAuth
            ? <ActivityIndicator size={30} color="#fff" />
            : <SubimitText>{nome ? 'Editar' : 'Cadastrar'}</SubimitText>}
        </SubimitButton>
        

      </Container>
    </KeyboardAvoidingView>
  )
}
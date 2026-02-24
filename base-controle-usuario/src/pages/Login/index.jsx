import { useState, useContext} from 'react';
import { ActivityIndicator, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { AuthContext } from '../../contexts/auth';

import {
  Container,
  AreaInput,
  Input,
  SubimitButton,
  SubimitText,
} from './styles'

import Titulo from '../../components/Titulo';

export default function Login() {

  const { loadingAuth, signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Digite um email e senha")
      return;
    }

    await signIn(email, password)

  }
  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        <Container>
          <Titulo/>
          <AreaInput>
            <Input
              keyboardType='email-address'
              placeholder='Email'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </AreaInput>
          <AreaInput>
            <Input
              style={{ width: "90%" }}
              placeholder='Senha'
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
            />
          </AreaInput>
          <SubimitButton onPress={handleLogin}>
            {loadingAuth
              ? <ActivityIndicator size={30} color="#fff" />
              : <SubimitText>Acessar</SubimitText>}
          </SubimitButton>
          
        </Container>
      </KeyboardAvoidingView>
    );
  
}
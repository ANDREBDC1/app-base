import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import {
  Container,
  AreaInput,
  SubimitButton,
  SubimitText,
  EditaPasswordButton,
  AreaSelect
} from './styles'

import Input from '../../components/Input';
import MultiSelectModal from '../../components/MultiSelectModal';

import { 
  getPermissions, 
  getPermissionsUser, 
  createUser, 
  updateUser,
  obterMensagemErro
} from '../../api/apiService';


export default function EditUser({ route }) {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(route.params ? true : false);

  const [selected, setSelected] = useState([]);

  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    if (route.params) {
      setNome(route.params.name);
      setEmail(route.params.email);
      setEditingPassword(false);
    } else {
      setEditingPassword(true);
    }
    navigation.setOptions({
      title: route.params ? 'Editar Usuário' : 'Novo Usuário',
    });

  }, [navigation]);


  useEffect(() => {

    async function loadPermissions() {
      try {
        if (route.params?.userId) {
          const userPermissions = await getPermissionsUser(route.params.userId);
          setSelected(userPermissions || []);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as permissões do usuário motivo: ' + obterMensagemErro(error));
      }
    }
    loadPermissions();

  }, [route.params?.userId]);


  useEffect(() => {

    async function loadPermissions() {
      try {
        setLoading(true);
        const data = await getPermissions();
        setPermissions(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as permissões motivo: ' + obterMensagemErro(error));
      } finally {
        setLoading(false);
      }
    }
    loadPermissions();

  }, []);


  async function handleEditUser() {
    if (nome === '' || email === '') {
      alert('Preencha todos os campos!');
      return;
    }
    setLoadingEdit(true);

    if (isEditing) {
      updateUser(route.params.userId, {
        name: nome,
        email: email,
        password: password, 
        permissions: selected 
      }).then(() => {
        setLoadingEdit(false);
        navigation.goBack();
      }).catch(error => {
        setLoadingEdit(false);
        Alert.alert('Erro', 'Não foi possível atualizar o usuário motivo: ' + obterMensagemErro(error));
      });

      return;
    }

    if (password === '') {
      alert('Preencha todos os campos!');
      return;
    }
    createUser({
      name: nome,
      email: email,
      password: password,
      permissions: selected
    }).then(() => {
      setLoadingEdit(false);
      navigation.goBack();
      setNome('');
      setEmail('');
      setPassword('');
      setSelected([]);
    }).catch(error => {
      setLoadingEdit(false);
      Alert.alert('Erro', 'Não foi possível criar o usuário motivo: ' + obterMensagemErro(error));
    });

  }

  return loading
    ? (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </Container>
    )
    : (
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
              icone={<MaterialIcons name="person" size={24} color="#5c5c5c" />}

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
              icone={<MaterialIcons name="email" size={24} color="#5c5c5c" />}

            />
          </AreaInput>
          <AreaInput>
            <Input
              editable={editingPassword}
              style={{ width: "90%" }}
              placeholder={isEditing ? 'Nova Senha' : 'Senha'}
              autoCorrect={false}
              autoCapitalize='none'
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              icone={<MaterialIcons name="lock" size={24} color="#5c5c5c" />}
            />
            {isEditing && <EditaPasswordButton onPress={() => setEditingPassword(!editingPassword)}>
              <MaterialIcons name="edit" size={24} color="#ffffff" />
            </EditaPasswordButton>
            }
          </AreaInput>
          <AreaSelect>
            <MultiSelectModal
              data={permissions}
              value={selected}
              onChange={setSelected}
              modalTitle="Selecionar permissões"
              placeholder='Permissões do usuário'
              valueKey="tipo"
              labelKey="descricao"
            />
          </AreaSelect>
          {
            loadingEdit
              ? <ActivityIndicator size={30} color="#fff" style={{ marginBottom: 20 }} />
              : <SubimitButton onPress={handleEditUser}>
                <SubimitText>{isEditing ? 'Editar' : 'Cadastrar'}</SubimitText>
              </SubimitButton>
          }
        </Container>
      </KeyboardAvoidingView>
    )

}
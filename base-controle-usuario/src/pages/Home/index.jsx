import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


import { 
  Container,
  ListUser,
  SearchInput
} from './styles';

import UserList from '../../components/UserList';


import { getUsers, deleteUser, obterMensagemErro } from '../../api/apiService';

export default function Home() {

  const [users, setUsers] = useState([]);

  const [searchText, setSearchText] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchText.toLowerCase()) || 
      user.email.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [users, searchText]);

  useFocusEffect(
    useCallback(() => {
      async function loadUsers() {
        try {
          const response = await getUsers();
          setUsers(response);
        } catch (error) {
           Alert.alert('Erro', 'Erro ao carregar usuários motivo: ' + obterMensagemErro(error));
      }
    }

    loadUsers();

  }, []));

  async function handleDeleteUser(id) {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      Alert.alert('Erro', 'Erro ao deletar usuário motivo: ' + obterMensagemErro(error));
    }
  }

 return (
   <Container>
      <SearchInput
        placeholder="Buscar usuários"
        onChangeText={(text) => {
          setSearchText(text);
        }}
      />
      <ListUser
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserList data={item}  onDelete={handleDeleteUser}/>}
      />
   </Container>
  );
}
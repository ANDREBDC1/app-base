
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Container,
  ContainerLog,
  TituloTexto,
  Email,
  Nome
} from './styles'
import { View } from 'react-native';

export default function HeaderMenu() {
  const { user } = useContext(AuthContext);
  return (
    <Container>
      <ContainerLog>
        <MaterialIcons name="admin-panel-settings" size={40} color="#12d7f1" />
        <TituloTexto>Admin Usuário</TituloTexto>
      </ContainerLog>
      <Nome>{user?.name.toUpperCase()}</Nome>
      <Email>{user?.email}</Email>
    </Container>
  );
}
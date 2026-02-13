
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import  {
  Container,
  TituloTexto
} from './styles'

export default function HeaderMenu() {
 return (
   <Container>
      <MaterialIcons name="admin-panel-settings" size={40} color="#12d7f1"/>
      <TituloTexto>Admin Usuário</TituloTexto>
   </Container>
  );
}
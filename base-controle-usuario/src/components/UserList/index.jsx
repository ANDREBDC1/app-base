import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  ContainerView,
  Container,
  Name,
  Email,
  DeleteButton
} from './styles';

import { MaterialIcons } from '@expo/vector-icons';


export default function UserList({ data, onDelete }) {


  function handleDelete() {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente deletar ${data.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => onDelete(data.id)
        }
      ]
    );
  }
  
 const navigation = useNavigation();
  return (
      <Container onPress={() => navigation.navigate('EditUser',
        { 
          name: data.name, 
          email: data.email,
          userId: data.id, 
        })
      }>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Name>{data.name}</Name>
          <Email>{data.email}</Email>

        </View>
        <DeleteButton onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color="#ff0000" />
        </DeleteButton>
      </Container>
  );
}

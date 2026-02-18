import { useNavigation } from '@react-navigation/native';
import { 
  Container,
  Name,
  Email
} from './styles';

export default function UserList({ data }) {
  
 const navigation = useNavigation();
  return (
    <Container onPress={() => navigation.navigate('EditUser',
      { 
        name: data.name, 
        email: data.email,
        userId: data.id, 
      })
    }>
      <Name>{data.name}</Name>
      <Email>{data.email}</Email>
    </Container>
  );
}

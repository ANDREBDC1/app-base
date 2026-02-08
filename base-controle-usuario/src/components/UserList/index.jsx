import { useNavigation } from '@react-navigation/native';
import { 
  Container,
  Name
} from './styles';

export default function UserList({ data }) {
  
 const navigation = useNavigation();
  return (
    <Container onPress={() => navigation.navigate('HomeStack',
      { 
        screen: 'PostUser', 
        params: { title: data.name, userId: data.id } 
      })
    }>
      <Name>{data.name}</Name>
    </Container>
  );
}

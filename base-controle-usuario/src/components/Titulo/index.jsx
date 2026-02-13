import { Text } from 'react-native';
import {
    Container
} from './styles'

export default function Titulo() {
    return (
        <Container>
            Administração <Text style={{ color: "#e52246" }}>Usuário</Text>
        </Container>
    );
}
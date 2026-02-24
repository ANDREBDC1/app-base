import { Text } from 'react-native';
import {
    Container
} from './styles'

export default function Titulo() {
    return (
        <Container>
            Admin <Text style={{ color: "#e52246" }}>Usuário</Text>
        </Container>
    );
}
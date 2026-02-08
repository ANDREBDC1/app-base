import { Container, TextInput, IconWrapper } from './styles';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Input({ 
  icone, 
  error = false, 
  ...props 
}) {
  return (
    <Container isError={error}>
      {icone && (
        <IconWrapper >
          {icone}
        </IconWrapper>
      )}
      <TextInput {...props} />
      {error && (
          <IconWrapper>
            <Ionicons name="alert-circle" size={30} color="#e52246" />
          </IconWrapper>
      )}
    </Container>
  );
}

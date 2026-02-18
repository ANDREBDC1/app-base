import { useState } from 'react';


import { 
  Container,
  ListUser
} from './styles';

import UserList from '../../components/UserList';

export default function Home() {

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    }
  ]);

 return (
   <Container>
      <ListUser
        data={users}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <UserList data={item} />}
      />
   </Container>
  );
}
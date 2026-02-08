import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import firestore  from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Container,
    Header,
    Avatar,
    Name,
    ContentView,
    Content,
    Actions,
    LikeButon,
    Like,
    TimePost
} from './styles';

export default function PostsList({ data, userId }) {

    const [likes, setLikes] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {

        async function VerificarLikes() {
            const linkeId = `${data.id}-${userId}`;
            const dataLikes = await firestore()
            .collection('linkes').doc(linkeId).get();
            setLikes(dataLikes.exists);
        }
        VerificarLikes();
    }, []);

    async function handerLikes (idPost, userId){

        const postRef = firestore().collection('posts').doc(idPost);

        const linkeId = `${idPost}-${userId}`;

        const likesRef = firestore().collection('linkes').doc(linkeId);
       

        try {
            await firestore().runTransaction(async (transaction) => {
                const postDoc = await transaction.get(postRef);
                const linkesDoc = await transaction.get(likesRef);
                const likes = postDoc.data().likes || 0;
                if (!linkesDoc.exists) {
                   transaction.set(likesRef, { postId: idPost, userId: userId });
                   
                   transaction.update(postRef, { likes: likes + 1 });
                   setLikes(true);
                   return;

                } 
                
                transaction.delete(likesRef);
                transaction.update(postRef, { likes: likes - 1 });
                setLikes(false);
                                          
            });
        } catch (error) {
            console.error("Transaction failed: ", error);
        }
    }

    function formatTimePost() {
        const dataPost = new Date(data.createdAt.seconds * 1000);
        return formatDistance(new Date(), dataPost, {
            locale: ptBR,
        }); 
    }

    return (
        <Container>
            <Header onPress={() => navigation.navigate('PostUser', { title: data.autor, userId: data.userId })}>
                <Avatar source={data.avatarUrl ? { uri: data.avatarUrl} : require('../../assets/avatar.png')} />
                <Name>{data.autor}</Name>
            </Header>
            <ContentView>
                <Content>{data.content}</Content>
            </ContentView>
            <Actions>
                <LikeButon onPress={() => handerLikes(data.id, userId)} >
                    <Like>{data.likes > 0 ? data.likes : ''}</Like>
                    <MaterialCommunityIcons
                        name={!likes ? "cards-heart-outline" : "cards-heart"}
                        size={20}
                        color="#e52246"
                    />
                </LikeButon>
                <TimePost>{formatTimePost()}</TimePost>
            </Actions>
        </Container>
    );
}
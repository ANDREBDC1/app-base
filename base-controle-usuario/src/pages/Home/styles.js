import styled from "styled-components/native";

export const Container = styled.View`
flex: 1;
`; 

export const ButtonPost = styled.TouchableOpacity`
 position: absolute;
 background-color: #202225;
 width: 60px;
 height: 60px;
 border-radius: 30px;
 align-items: center;
 justify-content: center;
 right: 6%;
 bottom: 6%;
`;

export const ListUser = styled.FlatList`
flex: 1;
background-color: #f1f1f1;
`;
import styled from "styled-components/native";

export const Container = styled.KeyboardAvoidingView`
flex: 1;
background-color: #303031;
justify-content: center;
align-items: center;
`

export const Titulo = styled.Text`
margin-bottom: 20px;
font-size: 35px;
font-style:italic;
color: #ffffff;
font-weight:bold ;
`

export const Input = styled.TextInput.attrs({
    placeholderTextColor: '#9c9999'
})`
background: #f1f1f1;
width: 90%;
font-size: 17px;
color: #9c9999;
border-radius: 8px;
padding: 10px;

`

export const AreaInput = styled.View`
flex-direction: row;
`
export const SubimitButton = styled.TouchableOpacity`
width: 90%;
height: 45px;
align-items: center;
justify-content: center;
background-color: #428cfd;
border-radius: 8px;
margin-top: 15px;
`

export const SubimitText = styled.Text`
font-size: 20px;
color: #f1f1f1;
`;


export const EditaPasswordButton = styled.TouchableOpacity`
flex: 0.1;
height: 50px;
align-items: center;
justify-content: center;
border-radius: 40px;
margin-right: 8px;
margin-top: 15px;
`



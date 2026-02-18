import styled from 'styled-components/native';

export const Container = styled.View` 
 flex: 1; 
 margin: 8px;
 background-color:#c5c5c5;
 align-items: center;
 justify-content: space-around;
 flex-direction: row;
 border-radius: 10px;
 padding-left: 5px;
 border:  ${props  => props.isError ? "2px solid " + "#e52246" : "0px"};

`;

export const TextInput = styled.TextInput.attrs({
    placeholderTextColor: '#fff',
    cursorColor:  "#Fff"
})`
flex:1;
height: 60px;
color: #fff;
font-size: 18px;
margin: 0px 4px
`;

export const IconWrapper = styled.View``
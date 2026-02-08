import styled from 'styled-components/native';

export const Container = styled.View.attrs({
    
})`
margin-top: 8px;
margin: 8px 2%;
background-color: #fff;
padding: 11px;
border-radius: 8px;
box-shadow:1px 1px 3px rgba(18, 18, 18, 0.2);
elevation: 5;
`;
export const Header = styled.TouchableOpacity`
width: 100%;
flex-direction: row;
align-items: center;
margin-bottom: 5px;

`;
export const Avatar = styled.Image`
width: 40px;
height: 40px;
margin-right: 8px;
border-radius: 20px;
`;
export const Name = styled.Text`
color: #353849;
font-size: 19px;
font-weight: bold;

`;
export const ContentView = styled.View`


`;
export const Content = styled.Text`
color: #353849;

`;


export const Actions = styled.View`
flex-direction: row;
justify-content: space-between;
align-items: baseline;
`;
export const LikeButon = styled.TouchableOpacity`
width: 55px;
flex-direction: row;
margin-top: 12px;
align-items: center;
justify-content: flex-start;

`;
export const Like = styled.Text`
color:#e52246;
margin-left: 6px;
margin-right: 5px;

`;
export const TimePost = styled.Text`
color: #353849;
margin-right: 6px;

`;
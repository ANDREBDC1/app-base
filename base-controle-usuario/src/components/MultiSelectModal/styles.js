
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #fff;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const CloseButton = styled.TouchableOpacity``;

export const Trigger = styled.TouchableOpacity`
  width: 100%;
  border: 1px solid #ccc;
  padding: 17px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #c5c5c5;
`;

export const TriggerText = styled.Text`
  color: #fff;
`;

export const SearchInput = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const SelectAllButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const SelectAllText = styled.Text`
  margin-left: 10px;
  font-weight: 500;
`;

export const Item = styled.TouchableOpacity`
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

export const ItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ItemText = styled.Text`
  margin-left: 10px;
  font-size: 16px;
`;

export const Checkbox = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 2px solid #7b1fa2;
  background-color: #7b1fa2;
  align-items: center;
  justify-content: center;
`;
import React, { useState, useMemo, useCallback } from "react";
import {
  Modal,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  Container,
  Trigger,
  TriggerText,
  Header,
  Title,
  CloseButton,
  SearchInput,
  SelectAllButton,
  SelectAllText,
  Item,
  ItemLeft,
  ItemText,
  Checkbox
} from "./styles";

export default function MultiSelectModal({
  data = [],
  value = [],
  onChange,
  labelKey = "label",
  valueKey = "value",
  placeholder = "Selecionar",
  modalTitle = "Selecionar itens",
}) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValues = useMemo(
    () => value.map(item => item[valueKey]),
    [value]
  );

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item[labelKey]
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  const toggleItem = useCallback(
    (item) => {
      const exists = selectedValues.includes(item[valueKey]);

      let updated;

      if (exists) {
        updated = value.filter(
          i => i[valueKey] !== item[valueKey]
        );
      } else {
        updated = [...value, item];
      }

      onChange(updated);
    },
    [value, selectedValues, onChange]
  );

  const toggleSelectAll = () => {
    if (value.length === data.length) {
      onChange([]);
    } else {
      onChange(data);
    }
  };

  const isAllSelected = value.length === data.length;

  return (
    <>
      {/* Trigger */}
      <Trigger onPress={() => setVisible(true)}>
        <TriggerText>
          {value.length > 0
            ? `${placeholder} ${value.length} selecionado(s)`
            : placeholder}
        </TriggerText>
        <Icon name="arrow-drop-down" size={24} color="#555" />
      </Trigger>

      {/* Modal */}
      <Modal visible={visible} animationType="slide">
        <Container>
          <Header>
            <Title>{modalTitle}</Title>

            <CloseButton onPress={() => setVisible(false)}>
              <Icon name="close" size={24} />
            </CloseButton>
          </Header>

          <SearchInput
            placeholder="Buscar..."
            value={search}
            onChangeText={setSearch}
          />

          {/* Select All */}
          <SelectAllButton onPress={toggleSelectAll}>
            <Checkbox>
              {isAllSelected && (
                <Icon name="check" size={18} color="#fff" />
              )}
            </Checkbox>

            <SelectAllText>
              {isAllSelected
                ? "Desmarcar todos"
                : "Selecionar todos"}
            </SelectAllText>
          </SelectAllButton>

          <FlatList
            data={filteredData}
            keyExtractor={(item) =>
              item[valueKey].toString()
            }
            renderItem={({ item }) => {
              const isSelected = selectedValues.includes(
                item[valueKey]
              );

              return (
                <Item onPress={() => toggleItem(item)}>
                  <ItemLeft>
                    <Checkbox>
                      {isSelected && (
                        <Icon
                          name="check"
                          size={18}
                          color="#fff"
                        />
                      )}
                    </Checkbox>

                    <ItemText>
                      {item[labelKey]}
                    </ItemText>
                  </ItemLeft>
                </Item>
              );
            }}
          />
        </Container>
      </Modal>
    </>
  );
}
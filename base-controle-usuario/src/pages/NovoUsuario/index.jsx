
import React, { useState, useContext, useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, Text, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import {
  Backgroud,
  Container,
  Titulo,
  AreaInput,
  Input,
  SubimitButton,
  SubimitText,
} from './styles'

export default function NovoUsuario() {
return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <Container>
         <Titulo/>
        <AreaInput>
          <Input
            keyboardType=''
            placeholder='Nome'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => setNome(text)}
            value={nome}
          />
        </AreaInput>
        <AreaInput>
          <Input
            keyboardType='email-address'
            style={{ width: "90%" }}
            placeholder='Email'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </AreaInput>
        <AreaInput>
          <Input
            style={{ width: "90%" }}
            placeholder='Senha'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
        </AreaInput>
        <SubimitButton onPress={handleSignUp}>
          {loadingAuth
            ? <ActivityIndicator size={30} color="#fff" />
            : <SubimitText>Cadastrar</SubimitText>}
        </SubimitButton>
        

      </Container>
    </KeyboardAvoidingView>
  )
}
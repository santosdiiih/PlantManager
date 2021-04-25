import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet, Text, View, TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Button } from '../components/Button'
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function UserIdentification(){
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false); 
    const [name, setName] = useState<string>();
    const navigation = useNavigation();

    function handlerInputBlur(){
        setIsFocused(false);
        setIsFilled(!!name);
    }
    function handleInputFocus(){
        setIsFocused(true);
    }
    function handleInputChange(value: string){
        setIsFilled(!!value);
        setName(value);
    }

    async function handlerSubmit(){

        if(!name)
            return Alert.alert('Me diz como te chamar 😅');

        try {
            await AsyncStorage.setItem('@plantmanager:user', name);
            navigation.navigate('Confirmation',{
                title: 'Prontinho',
                subTitle: 'Agora vamos começar a cuidar das sua plantinhas com muito cuidado.',
                buttonTitle: 'Começar',
                icon: 'smile',
                nextScreen:  'PlantSelect'
            });
        } 
        catch {
            Alert.alert("Não foi possivel salvar o seu nome  😭");
        }
        
    }

    return(
        <SafeAreaView style={style.container}>
            <KeyboardAvoidingView 
            style={style.container}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={style.content}>
                        <View style={style.form}> 
                            <View style={style.header}>
                                <Text style={style.emoji}>
                                {isFilled ? '😃' : '😄'}  
                                </Text>
                                <Text style={style.title}>
                                    Como podemos {'\n'}
                                    chamar você ?
                                </Text>
                            </View>
                            <TextInput 
                                style={[
                                    style.input,
                                    (isFocused || isFilled) && {borderColor: colors.green}
                                ]}
                                placeholder="Digite seu nome"
                                onBlur={handlerInputBlur}
                                onFocus={handleInputFocus}
                                onChangeText={handleInputChange}
                            />
                            <View style={style.footer}>
                                <Button 
                                    title="Confirmar"
                                    onPress={handlerSubmit}
                                /> 
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};


const style = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        width: '100%'
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
        alignItems: 'center',
        width: '100%'
    },
    header:{
        alignItems: 'center'
    },
    emoji:{
        fontSize: 44
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    title:{
        fontSize: 24,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 32,
        marginTop: 20
    },
    footer:{
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20,
        
    }
});

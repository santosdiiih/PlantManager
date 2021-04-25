import React from 'react';
import {
    SafeAreaView, View, StyleSheet, Text
} from 'react-native';
import colors  from '../styles/colors';
import font from '../styles/fonts';
import { Button } from '../components/Button';
import { useNavigation, useRoute } from '@react-navigation/core';

interface Params{
    title: string;
    subTitle: string;
    buttonTitle: string;
    icon: 'smile' | 'hug';
    nextScreen: string; 
}

const emoji ={
    hug: '🤗',
    smile: '😄'
}

export function Confirmation(){
    const navigation = useNavigation();
    const routes = useRoute();

    const {
        title,
        subTitle,
        buttonTitle,
        icon,
        nextScreen

    } = routes.params as Params;

    function handlerSubmit(){
        navigation.navigate(nextScreen);
    }

    return(
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <Text style={style.emoji}>
                    {emoji[icon]}
                </Text>
                <Text style={style.title}>
                   {title}
                </Text>
                <Text style={style.subTitle}>
                    {subTitle}
                </Text>
                <View style={style.footer}>
                    <Button 
                        title={buttonTitle}
                        onPress={handlerSubmit}
                    />
                </View>
            </View>
            
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 30
    },
    emoji:{
        fontSize: 78,

    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        color: colors.heading,
        lineHeight: 38,
        marginTop: 15
    },
    subTitle: {
        fontFamily: font.text,
        textAlign: 'center',
        fontSize: 17,
        paddingVertical: 10,
        color: colors.heading
    },
    footer: {
        width: '100%',
        paddingHorizontal: 50,
        marginTop: 20 
    }
});









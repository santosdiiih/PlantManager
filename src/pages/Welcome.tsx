import React from 'react';
import { 
    SafeAreaView, Text, Image, TouchableOpacity,
     Dimensions, StyleSheet, View 
} from 'react-native';
import wateringImg from '../assets/watering.png';
import colors from '../styles/colors';
import { Feather } from '@expo/vector-icons';
import fonts from '../styles/fonts';
import { useNavigation } from '@react-navigation/core';

export function Welcome(){

    const navigation = useNavigation();

    function handlerStart(){
        navigation.navigate('UserIdentification');
    }

    return(
        <SafeAreaView style={style.container}>
            <View style={style.wrapper}>
                <Text style={style.title}>
                    Gerencie {'\n'}
                    suas plantas de{'\n'}
                    forma fácil.
                </Text>
                <Image 
                    source={wateringImg} style={style.image}
                    resizeMode='contain'
                />
                <Text style={style.subTitle}>
                    Não esqueça mais de regar  suas plantas. {'\n'}
                    Nós cuidamos de lembrar você {'\n'}
                    sempre que precisar.
                </Text>

                <TouchableOpacity 
                    style={style.button} 
                    activeOpacity={0.8}
                    onPress={handlerStart}> 
                    <Feather name="chevron-right" style={style.buttonIcon}/>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.heading,
        marginTop: 38,
        fontFamily: fonts.heading,
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: fonts.text,
        paddingHorizontal: 20,
        color: colors.heading
    },
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width: 56
    },
    buttonIcon: {
        fontSize: 32,
        color: colors.white
    },
    image: {
        height: Dimensions.get('window').width * 0.7
    },
   
});
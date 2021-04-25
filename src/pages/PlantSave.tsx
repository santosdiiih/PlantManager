import React, { useState } from 'react';
import {
    Alert, StyleSheet,
    Text, View,
    Image, ScrollView,
    Platform, TouchableOpacity
} from 'react-native';
import { SvgFromUri } from 'react-native-svg';
import WaterDrop from '../assets/waterdrop.png'
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'; 
import { format, isBefore } from 'date-fns';
import { loadPlant, PlantProps, savePlant } from '../libs/Storage';

interface Params {
    plant: PlantProps
}


export function PlantSave(){

    const route = useRoute();
    const { plant } = route.params as Params;
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios');
    const navigation = useNavigation();

    function handleChangeTime(event: Event, dateTime: Date | undefined){
        if(Platform.OS == 'android'){
            setShowDatePicker(oldState => !oldState);
        }
        if(dateTime && isBefore(dateTime, new Date())){
            setSelectedDateTime(new Date());
            return Alert.alert("Escolha uma hora no futuro 🧭");
        }
        if(dateTime)
            setSelectedDateTime(dateTime);
    }

    function handleDateTimePickerForAndroid(){
        setShowDatePicker(oldState => !oldState);
    }

    async function handleSave(){
         try {
             await savePlant({
                 ...plant,
                 dateTimeNotification: selectedDateTime
        });
        navigation.navigate('Confirmation',{
            title: 'Tudo certo.',
            subTitle: 'Fique tranquilo que agora vamos cuidar das suas plantinhas com muito cuidado.',
            buttonTitle: 'Muito Obrigado',
            icon: 'hug',
            nextScreen:  'MyPlants'
        });

        } 
         catch (error) {
             Alert.alert("Não foi possivel salvar seus dados 😭");
         }
    }

    return(
        <ScrollView showsVerticalScrollIndicator={false} 
        contentContainerStyle={style.container}>
            <View style={style.container}>
                <View style={style.plantInfo} >
                        
                    <SvgFromUri 
                        uri={plant.photo}
                        height={150}
                        width={150}
                    />
                    <Text style={style.plantsName}>
                        {plant.name} 
                    </Text>
                    <Text style={style.plantAbout}>
                        {plant.about}
                    </Text>
                </View>
                <View style={style.controller} >
                    <View style={style.tipContainer}>  
                        <Image source={WaterDrop} style={style.tipImage} />

                        <Text style={style.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>
                    <Text style={style.alertLabel}>
                        Escolha o melhor horario para ser lembrado:
                    </Text>

                    { showDatePicker &&
                        (<DateTimePicker 
                            value={selectedDateTime}
                            mode='time'
                            display="spinner"
                            onChange={handleChangeTime} />
                        )}
                        {
                            Platform.OS == 'android' && (
                            <TouchableOpacity 
                                    style={style.dateTimePickerButton}
                                    onPress={handleDateTimePickerForAndroid}>
                                    <Text style={style.dateTimePickerText}>
                                        {`Mudar ${format(selectedDateTime, 'HH:mm')} `}
                                    </Text>
                            </TouchableOpacity>
                            )
                        }

                    < Button 
                        title="Cadastrar Planta"
                        onPress={handleSave}
                    />
                </View>
            </View>
        </ScrollView>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
        
    },
    plantsName: {
        textAlign: 'center',
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    tipContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60,

    },
    tipImage:{
        width: 56,
        height: 56,
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    }
})

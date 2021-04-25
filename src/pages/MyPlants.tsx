import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View, Image,
    Text, FlatList, ScrollView, Alert

} from 'react-native';
import { Header } from '../components/Header';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import waterdrop from '../assets/waterdrop.png';
import { PlantProps, loadPlant, removePlant } from '../libs/Storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import { PlantCardSecundary } from '../components/PlantCardSecundary';
import { Load } from '../components/Load';


export function MyPlants(){

    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [ loading, setLoading] = useState(true);
    const [nextWaterd, setNextWaterd] = useState<string>();

    function handleRemove (plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover à ${plant.name}?`, [
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😪',
                onPress: async () => {
                    try {
                        
                        await removePlant(plant.id);

                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id != plant.id)
                        );
                    } 
                    catch (error) {
                        Alert.alert("Não foi possivel Remover! 😪"); 
                    }
                }
            }
        ]);
    }

    useEffect(() => {
        async function loadStoragedData(){
            const plantsStoraged = await loadPlant();
            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                {locale: pt}
            );
            setNextWaterd(
                `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas.`
            )
            setMyPlants(plantsStoraged);
            setLoading(false);
        }
        loadStoragedData();
    }, []);

    if(loading)
        return <Load />

    return(
        <View style={style.container}>
            
            <Header />
            <View  style={style.spotLight}>
                <Image
                    source={waterdrop}
                    style={style.spotLightImage}
                /> 
                <Text style={style.spotLightText}>
                    {nextWaterd}
                </Text>
            </View>
            <Text style={style.plantTitle}> 
                Próximas regadas.
            </Text>    
            <ScrollView style={style.myPlants} showsVerticalScrollIndicator={false}>
                <View>
                    <FlatList 
                        data={myPlants}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({item}) => (
                            <PlantCardSecundary 
                                data={item}
                                handleRemove={() => {handleRemove(item)}}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flex: 1}}
                    />
                </View>
            </ScrollView>
        </View>
    )
}


const style = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotLight:{
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    spotLightImage:{
        width: 60,
        height: 60
    },
    spotLightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
        
    },
    myPlants: {
        flex: 1,
        width: '100%',
    },
    plantTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
  
});
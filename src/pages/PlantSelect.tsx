import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import {Header} from '../components/Header';
import { EnviromentButton } from '../components/EnviromentButtons';
import api from '../services/api';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import {Load } from '../components/Load';
import { useNavigation } from '@react-navigation/core';
import { PlantProps } from '../libs/Storage';


interface EnviromentProps{
    key: string;
    title: string
}



export function PlantSelect(){

    const [enviroments, setEnviroments] = useState<EnviromentProps[]>([]);
    const [plants, setPlants] = useState<PlantProps[]>([]);
    const [filteredPlants, setfilteredPlants] = useState<PlantProps[]>([]);
    const [enviromentSelected, setEnviromentSelect] = useState('all');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigation = useNavigation();

    async function fetchPlants(){
        const {data} = 
            await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setLoading(true);

        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data])
            setfilteredPlants(oldValue => [...oldValue, ...data])
        }
        else{
            setPlants(data);
            setfilteredPlants(data);
        }

        
        setLoading(false);
        setLoadingMore(false);
    }

    function handleEnviromentSelect(environment: string){
        setEnviromentSelect(environment);

        if(environment == 'all'){
            return setfilteredPlants(plants);
        }
        else{
            const filtered = plants.filter(plant =>  
                plant.environments.includes(environment)
            )
            return setfilteredPlants(filtered);
        }
    }

    function handleFetchMore(distance: number){
        if(distance < 1)
            return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants()
    }

    function handlePlantSelect(plant: PlantProps){
        navigation.navigate('PlantSave', {plant});
        
    }

    useEffect(() => {
        async function fetchEnviroment(){
            const { data } = await api.get('plants_environments?_sort=name&_order=asc');
            setEnviroments([{
                key: 'all',
                title: 'Todos'
                },
            ...data
            ]);
        }
        fetchEnviroment();
    }, []);

    useEffect(() => {
       
        fetchPlants();
    }, []);

    if(loading)
        return <Load />
    

    return(
        <View style={style.container}>
            <View style={style.header}>
                <Header />
                <Text style={style.title}>
                    Em qual ambiente 
                </Text>
                <Text style={style.subTitle}>
                    você quer colocar a sua planta? 
                </Text>
            </View>
            <View>
                <FlatList 
                    data={enviroments}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item }) => (
                        <EnviromentButton
                            title={item.title}
                            active={item.key == enviromentSelected}
                            onPress={() => handleEnviromentSelect(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={style.enviromentList}
                />
            </View>
            <View style={style.plants}>
            <FlatList 
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary
                             data={item} 
                             onPress={() => handlePlantSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => 
                        handleFetchMore(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadingMore ?
                        <ActivityIndicator color={colors.green_dark}/>
                        : <></>
                    }
                />   
            </View>
            

        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subTitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    enviromentList:{
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
    },
    plants:{
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
    
});
import React, {useEffect} from 'react';
import Routes from './src/routes';
import * as Notifications from 'expo-notifications';
import {
  useFonts, 
  Jost_400Regular, 
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';
import { PlantProps } from './src/libs/Storage';


export default function App(){

  const [fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    const subScription = Notifications.addNotificationReceivedListener(
      async notification =>  {
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data);
      })
      return subScription.remove();
  },[])

  if(!fontsLoaded)
    return (
      <AppLoading/>
    )
  

  return(
      <Routes />
  )
}


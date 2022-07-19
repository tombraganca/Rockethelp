import React from "react";
import { NativeBaseProvider, StatusBar } from "native-base";
import { Roboto_400Regular, Roboto_700Bold, useFonts } from "@expo-google-fonts/roboto";

import { THEME } from "./src/styles/theme";
import { SignIn } from "./src/screen/Signin";
import {Loading} from './src/components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
      barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {fontsLoaded ?  <SignIn /> : <Loading/>}
     
    </NativeBaseProvider>
  );
}

import React, { useState, useEffect } from "react";
import "react-native-get-random-values";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';

import { UserContextProvider } from "./src/contexts/UserContext";
import Root from "./src/navigation/Root";

// Splash screen 유지
SplashScreen.preventAutoHideAsync();

// 전역 폰트 설정 - 모든 Text 컴포넌트
const customTextProps = {
  style: {
    fontFamily: 'Cafe24SsurroundAir'
  }
};

setCustomText(customTextProps);
setCustomTextInput(customTextProps);

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Cafe24Ssurround': require('./assets/fonts/Cafe24Ssurround-v2.0.ttf'),
          'Cafe24SsurroundAir': require('./assets/fonts/Cafe24SsurroundAir-v1.1.ttf'),
        });
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('폰트 로딩 실패:', error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // 폰트 로딩 중
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <UserContextProvider>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </UserContextProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

export default App;

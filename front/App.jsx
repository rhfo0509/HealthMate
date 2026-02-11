import React, { useState, useEffect } from "react";
import "react-native-get-random-values";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Text } from 'react-native';

import { UserContextProvider } from "./src/contexts/UserContext";
import Root from "./src/navigation/Root";

// Splash screen 유지
SplashScreen.preventAutoHideAsync();

// 글로벌 기본 폰트 설정
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.style = { fontFamily: 'Paperlogy-Regular' };

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Cafe24Ssurround': require('./assets/fonts/Cafe24Ssurround-v2.0.ttf'),
          'Cafe24SsurroundAir': require('./assets/fonts/Cafe24SsurroundAir-v1.1.ttf'),
          'SUIT-Regular': require('./assets/fonts/SUIT-Regular.ttf'),
          'SUIT-Medium': require('./assets/fonts/SUIT-Medium.ttf'),
          'SUIT-SemiBold': require('./assets/fonts/SUIT-SemiBold.ttf'),
          'SUIT-Bold': require('./assets/fonts/SUIT-Bold.ttf'),
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

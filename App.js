// 설치할 때 npx expo install 패키지명으로 설치하기

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./screens/RootStack";
import { UserContextProvider } from "./contexts/UserContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import "react-native-get-random-values";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <UserContextProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </UserContextProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

export default App;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./src/navigation/Root";
import { UserContextProvider } from "./src/contexts/UserContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import "react-native-get-random-values";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
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

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './screens/LoginPage';
import HomePage from './screens/HomePage';
import SignUpPage from './screens/SignUpPage';

/* Stacknavigator Quelle von Docs: https://reactnavigation.org/docs/getting-started/ */
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginPage} />
        <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUpPage} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

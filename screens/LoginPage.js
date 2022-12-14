import { SafeAreaView, TouchableWithoutFeedback, Button, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'





const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navi = useNavigation()




  useEffect(() => {

  }, [])


  const goToSignUp = () => {
    navi.navigate("SignUp")
  }

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Eingelogt:', user.email, user.uid);
        navi.navigate("Home")
      })
      .catch(error => alert(error.message))
  }



  return (


    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.content}>
          <Text style={styles.titel}>Log In</Text>
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputField}
          />
          <TextInput
            placeholder='Passwort'
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.inputField}
            secureTextEntry
          />
          <Button
            fontFamily= "Trebuchet MS"
            title="Sign Up"
            onPress={goToSignUp}
          />
          <View style={styles.btnContainer}>
            <Button 
              color="white"
              title="Log In" 
              onPress={handleLogin}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default LoginPage

const styles = StyleSheet.create({


  container: {
    flex: 1,
  },
  content: {
    fontFamily: "Trebuchet MS",
    flex: 1,
    margin: 25,
    marginTop: 65,
  },
  titel: {
    fontFamily: "Trebuchet MS",
    fontSize: 39,
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    fontFamily: "Trebuchet MS",
    height: 39,
    backgroundColor: "white",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
  },
  btnContainer: {
    fontFamily: "Trebuchet MS",
    height: 40,
    position: "absolute",
    bottom: "5%",
    width: "100%",
    backgroundColor: "black",
    borderRadius: 20,
  },

})
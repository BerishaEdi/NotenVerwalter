import { SafeAreaView, TouchableWithoutFeedback, Button, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const SignUpPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navi = useNavigation()

  const goToLogIn = () => {
    setUsername()
    setEmail()
    setPassword()
    navi.navigate("Login")
  }

  const SignUp = () => {
    /* Quelle SignUp Funktion: https://firebase.google.com/docs/auth/web/password-auth */
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        db.collection("users").doc(user.uid).set({
            name: username,
            mail: email,
            password: password,
            uid: user.uid,
        })
        console.log(user.uid + " + " + auth.currentUser?.email);
        navi.navigate("Home");

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.content}>
          <Text style={styles.titel}>Sign Up</Text>
          <TextInput
            placeholder='Benutzername'
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.inputField}
          />
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
            title="Log in"
            onPress={goToLogIn}
          />
          <View style={styles.btnContainer}>
            <Button 
              color="white"
              title="Sign Up" 
              onPress={SignUp}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpPage;

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
        backgroundColor: "white",
        height: 40,
        position: "absolute",
        bottom: "5%",
        width: "100%",
        backgroundColor: "black",
        borderRadius: 20,
      },
});

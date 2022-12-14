import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    Button,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Alert

} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/core";
import DialogInput from 'react-native-dialog-input';
import { useGlobalState, setGlobalState } from '../App';
import { DeviceMotion } from 'expo-sensors';

const HomePage = () => {
    const navi = useNavigation();
    const dbRef = db.collection("users");
    const [username, setUsername] = useState("")
    const [subject, setSubject] = useState()
    const [uid, setUid] = useState();
    const [subjectArray, setSubjectArray] = useState([]);
    const [gradesArray, setGradesArray] = useState([]);
    const [subjectId, setSubjectId] = useState("0")


    /* abmelden Funktion */
    const SignOut = () => {
        auth
            .signOut()
            .then(() => {
                setUsername();
                setUid();
                setSubject()
                setGradesArray([])
                setSubjectArray([])
                setSubjectId()
                navi.replace("Login");
            })
            .catch((error) => alert(error.message));
    };


    const goToGrades = (id) => {
        setGlobalState("docId", id)
        navi.navigate("Grades");
    }



    const loadContent = () => {
        /* daten lesen methode von: https://firebase.google.com/docs/firestore/query-data/get-data */

        /* username von datenbank lesen */
        dbRef
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setUsername(doc.data().name);
                } else {
                    console.log("kein solches Dokument");
                }
            });




        /* alle fächer von datenbank lesen und in array speichern */
        db.collection("subjects")
            .where("uid", "==", firebase.auth().currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setSubjectArray((current) => [
                        ...current,
                        {
                            id: doc.id,
                            subject: doc.data("subjectName").subjectName,
                        },
                    ]);
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        console.log(subjectArray);

    };



    useEffect(() => {
        setSubjectArray([]);
        setGradesArray([]);

        /* überprüft ob und welcher user angemeldet ist */
        const user = firebase.auth().currentUser;
        if (user) {
            console.log("Hallo user mit id: " + user.uid);
            setUid(firebase.auth().currentUser.uid);
            loadContent()
            calculateSubjectAverage()
            console.log(gradesArray)
        } else {
            console.log("kein nutzer");
        }

/* Sensor der erkennt falls das gerät geschütelt wird, leitet dann user zum login zurück: https://docs.expo.dev/versions/latest/sdk/devicemotion/ */
        DeviceMotion.addListener(data => {
            const { acceleration } = data;
            if (acceleration.x > 35 || acceleration.y > 35 || acceleration.z > 35) {
              SignOut()
              navi.navigate('Login');
            } 
          });




    }, []);



/* fach in die datenbank einfügen */
    const addSubject = () => {
        if(subject != null){
        setSubjectArray([]);
        db.collection("subjects")
            .add({
                subjectName: subject,
                uid: uid,
            })
            .then((docRef) => {
                console.log("Document written with Id: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        loadContent()
        }else {
            popUpAlert()
        }
    };


    const popUpAlert = () =>
        /* Quelle für Alert: https://reactnative.dev/docs/alert */
        Alert.alert(
            "Fehlerhafte Eingabe",
            "Geben sie bitte einen gültigen Wert ein",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", }
            ]
        );



        



    const renderSubject = ({ item }) => (
        <View style={{ marginBottom: 15 }}>
            <TouchableOpacity onPress={() => goToGrades(item.id)}>
                <Text style={{ fontSize: "30", fontweight: "normal", color: "Black" }}>{item.subject}</Text>
            </TouchableOpacity>

        </View>
    );




    const calculateSubjectAverage = () => {
        db.collection("subjects")
            .where("uid", "==", firebase.auth().currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setGradesArray((current) => [
                        ...current,
                        {
                            gradesList: doc.data().grades,
                            name: doc.data().subjectName,
                        },
                    ]);
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }



    return (
        <SafeAreaView style={styles.content}>
            <Text style={styles.welcome}>Hallo {username}</Text>
            <Text style={{ fontSize: 26 }}>Neues Fach hinzufügen</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setSubject(text)}
                placeholder="Fach"
            />
            <View style={styles.btnContainer}>
                <Button style={styles.logOutButton} title="Hinzufügen" color="white" onPress={addSubject} />
            </View>
            <View style={styles.logOutButton}>
                <Button color="white" title="Abmelden" onPress={SignOut} />
            </View>
            <View style={styles.average}>
                <Text>Dein Aktueller Schnitt ist </Text>
                <Text style={{ textAlign: "center" }}>Schnitt</Text>
            </View>
            <FlatList
                data={subjectArray}
                renderItem={renderSubject}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    content: {
        fontFamily: "Trebuchet MS",
        padding: 24,
        flex: 1,
        margin: 20,
        marginTop: 60,
    },
    button: {
        fontFamily: "Trebuchet MS",
        marginTop: 40,
        backgroundColor: "Black",
        width: "60%",
        padding: 15,
        borderRadius: 15,
    },
    buttonSignOut: {
        fontFamily: "Trebuchet MS",
        marginTop: 20,
        width: "30%",
        textAlign: "center",
        alignSelf: "center",
    },
    buttonText: {
        fontFamily: "Trebuchet MS",
        textAlign: "center",
    },
    header: {
        fontFamily: "Trebuchet MS",
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
    },
    welcome: {
        fontFamily: "Trebuchet MS",
        alignSelf: "center",
        fontSize: "20",
        marginBottom: 30,
    },
    input: {
        fontFamily: "Trebuchet MS",
        height: 40,
        backgroundColor: "white",
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    },
    btnContainer: {
        fontFamily: "Trebuchet MS",
        backgroundColor: "black",
        height: 50,
        width: "50%",
        alignSelf: "center",
        borderRadius: 20,
        marginTop: 10,
        justifyContent: "center",
    },
    average: {
        textAlign: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: "10%",
    },
    logOutButton: {
        margin: "3%",
        justifyContent: "center",
        backgroundColor: "black",
        width: "30%",
        alignSelf: "center",
        borderRadius: 20,
        height: 50,
    }
});

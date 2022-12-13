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
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/core";

const HomePage = () => {

    const navi = useNavigation()
    const dbRef = db.collection("users");
    const [username, setUsername] = useState("")
    const [subject, setSubject] = useState("Fachname")
    const [uid, setUid] = useState()
    const [docId, setDocId] = useState()
    const [subjectArray, setSubjectArray] = useState([])


    const SignOut = () => {
        auth
            .signOut()
            .then(() => {
                setUsername("")
                setUid("")
                navi.replace("Login");
            })
            .catch((error) => alert(error.message));
    };

    const loadContent = () => {
        /* Daten Lesen Methode von: https://firebase.google.com/docs/firestore/query-data/get-data */
        dbRef.doc(firebase.auth().currentUser.uid).get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setUsername(doc.data().name)
            } else {
                console.log("kein solches Dokument");
            }
        })


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

            console.log(subjectArray)

    }




    useEffect(() => {

        setSubjectArray([])

        const user = firebase.auth().currentUser;
        if (user) {
            console.log("Hallo user mit id: " + user.uid)
            setUid(firebase.auth().currentUser.uid)
            loadContent()
        } else {
            console.log("kein nutzer")
        }

        console.log("################################")
    }, []);






    const addSubject = () => {

        db.collection("subjects")
            .add({
                subjectName: subject,
                uid: uid,
            })
            .then((docRef) => {
                setDocId(docRef.id);
                console.log("Document written with Id: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });

        setSubjectArray((current) => [
            ...current,
            {
                id: docId,
                subject: subject,
            },
        ]);

        setSubject()
        console.log(subjectArray)
    };




    const renderItem = ({item}) => (
        <View>
            <Text style={{ fontSize: "25", fontweight: "normal", color: "Black" }}>{item.subject}</Text>
        </View>
    );




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
                <Button title="Hinzufügen" color="white" onPress={addSubject} />
            </View>
            <Button
                color="black"
                title="Abmelden"
                onPress={SignOut}
            />
            <FlatList
                data={subjectArray}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
};

export default HomePage;

const styles = StyleSheet.create({
    content: {
        padding: 24,
        flex: 1,
        margin: 20,
        marginTop: 60,
    },
    button: {
        marginTop: 40,
        backgroundColor: "#5DB075",
        width: "60%",
        padding: 15,
        borderRadius: 15,
    },
    buttonSignOut: {
        marginTop: 20,
        width: "30%",
        textAlign: "center",
        alignSelf: "center",
    },
    buttonText: {
        textAlign: "center",
    },
    header: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
    },
    welcome: {
        alignSelf: "center",
        marginBottom: 30,
    },
    input: {
        height: 40,
        backgroundColor: "white",
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    },
    btnContainer: {
        backgroundColor: "white",
        height: 50,
        width: "50%",
        alignSelf: "center",
        backgroundColor: "#5DB075",
        borderRadius: 20,
        marginTop: 10,
        justifyContent: "center",
    },

    
});

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
import React, { useEffect, useState } from 'react'
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/core";
import DialogInput from 'react-native-dialog-input';
import { auth, db } from "../firebase";
import { useGlobalState, setGlobalState } from '../App'



const Grades = () => {


    const [globalKey] = useGlobalState("docId")
    const [grade, setGrade] = useState("")
    const navi = useNavigation()
    const [gradesArray, setGradesArray] = useState([])
    const [subject, setSubject] = useState()



    const addGrade = () => {

        console.log(grade+" hfhfhf")
        /* setGradesArray(items.push(grade)); */
        setGradesArray([...gradesArray, 'new value']);
        console.log(gradesArray+"hfhfhf")
        db.collection("subjects")
            .doc(globalKey)
            .update({
                grades: gradesArray,
            })
            .then((docRef) => {
                console.log("GDocument written with Id:");
            })
            .catch((error) => {
                console.error("Error adding Gdocument: ", error);
            });
        loadContent()

    }


    const loadContent = () => {
        /* alle Noten von datenbank lesen und in array speichern */
        db.collection("subjects")
            .doc(globalKey)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data().grades);
                    setGradesArray(doc.data().grades);
                } else {
                    console.log("kein solches Dokument");
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        console.log(gradesArray);

    };




    useEffect(() => {

        setGradesArray([]);
        db.collection("subjects")
            .doc(globalKey)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setSubject(doc.data().subjectName);
                    loadContent()
                } else {
                    console.log("kein solches Dokument");
                }
            });


    }, [])


    const renderGrades = ({ item }) => (
        <View style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: "25", fontweight: "normal", color: "black", textAlign: "center" }}>{item}</Text>
        </View>
    );



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.content}>
                    <Text style={styles.titel}>Note Hinzufügen in {subject}</Text>
                    <TextInput
                        placeholder='Note'
                        value={grade}
                        onChangeText={text => setGrade(text)}
                        style={styles.inputField}
                        keyboardType='numeric'
                    />
                    <View style={styles.btnContainer}>
                        <Button
                            color="white"
                            title="Bestätigen"
                            onPress={addGrade}
                        />
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
            <FlatList
                data={gradesArray}
                renderItem={renderGrades}
            />
        </KeyboardAvoidingView>
    )
}

export default Grades

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
        backgroundColor: "white",
        height: 40,
        width: "100%",
        backgroundColor: "black",
        borderRadius: 20,
    },

})
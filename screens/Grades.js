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
import React, { useEffect, useState } from 'react'
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/core";
import DialogInput from 'react-native-dialog-input';
import { auth, db } from "../firebase";
import { useGlobalState, setGlobalState } from '../App'


const Grades = () => {


    const [globalKey] = useGlobalState("docId")
    const [grade, setGrade] = useState()
    const navi = useNavigation()
    const [gradesArray, setGradesArray] = useState([])
    const [subject, setSubject] = useState()
    const [average, setAverage] = useState()



    const addGrade = () => {
        if (grade != null) {
            console.log(grade + " hfhfhf")
            gradesArray.push(grade)
            console.log(gradesArray + " hfhfhf")
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
        } else {
            popUpAlert()
        }
    }



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




    const loadContent = () => {
        /* alle Noten von datenbank lesen und in array speichern */
        db.collection("subjects")
            .doc(globalKey)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().grades != null) {
                    console.log("Document data:", doc.data().grades);
                    setGradesArray(doc.data().grades);
                } else {
                    console.log("kein solches Dokument");
                    if (grade != null) {
                        addGrade()
                    }
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        console.log(gradesArray);
        setGradesArray([])
        setGrade(),
        setAverage()
    };






    useEffect(() => {
        setGradesArray([]);
        /* den namen des faches von der datenbank beziehen */
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



    const calculateAverage = () => {

        var sum = 0;
        for (var grade of gradesArray) {
            sum += parseFloat(grade)
        }
        var average = sum / gradesArray.length;
        setAverage(average);
        console.log(average);
        console.log(sum)
        console.log(gradesArray)
        Alert.alert(
            "Dein aktueller Schnitt in "+ subject +" ist " + average,
            "",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", }
            ]
            )

    }


    const deleteSubject = () => {

        /* lösch funktion aus firestore docs: https://firebase.google.com/docs/firestore/manage-data/delete-data */
        db.collection("subjects").doc(globalKey).delete().then(() => {
            console.log("Document successfully deleted!")
            navi.navigate("Login")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    
    }






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

                    <Text style={styles.titel}>Note hinzufügen in {subject}</Text>
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
                            title="Hinzufügen"
                            onPress={addGrade}
                        />
                    </View>
                    <View style={styles.average}>
                        <Button
                            color="white"
                            title="Zeige meine Schnitt"
                            onPress={calculateAverage}
                        />
                    </View>
                    <Text style={styles.txt} >
                        Deine Noten im Fach {subject} =
                    </Text>
                </SafeAreaView>
            </TouchableWithoutFeedback>
            <FlatList
                data={gradesArray}
                renderItem={renderGrades}
            />
            <View style={styles.deletContainer}>
                <Button
                    color="white"
                    title="Fach Löschen"
                    onPress={deleteSubject}
                />
            </View>
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
        marginTop: 50,
    },
    titel: {
        fontFamily: "Trebuchet MS",
        fontSize: 39,
        marginBottom: 35,
        textAlign: "center",
        fontWeight: "bold",
    },
    inputField: {
        fontFamily: "Trebuchet MS",
        height: 39,
        backgroundColor: "white",
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    },
    txt: {
        textAlign: "center",
        marginBottom: "auto",
        fontSize:15,
    },
    btnContainer: {
        fontFamily: "Trebuchet MS",
        backgroundColor: "white",
        height: 40,
        width: "100%",
        backgroundColor: "black",
        borderRadius: 20,
    },
    deletContainer: {
        textAlign: "center",
        alignSelf: "center",
        fontFamily: "Trebuchet MS",
        backgroundColor: "white",
        height: 40,
        width: "91%",
        backgroundColor: "black",
        borderRadius: 20,
        marginBottom: "9%"
    },
    average: {
        
        fontFamily: "Trebuchet MS",
        backgroundColor: "white",
        height: 40,
        width: "100%",
        backgroundColor: "black",
        borderRadius: 20,
        marginTop: "3%",
    },

})
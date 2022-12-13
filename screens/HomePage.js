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
import DialogInput from 'react-native-dialog-input';

const HomePage = () => {
    const navi = useNavigation();
    const dbRef = db.collection("users");
    const [username, setUsername] = useState("");
    const [subject, setSubject] = useState("Fachname");
    const [uid, setUid] = useState();
    const [docId, setDocId] = useState()
    const [docIdGrades, setDocIdGrades] = useState();
    const [subjectArray, setSubjectArray] = useState([]);
    const [grade, setGrade] = useState();
    const [gradesArray, setGradesArray] = useState([]);



    const [visible, setVisible] = useState(false);
    const [input, setInput] = useState('');

    const SignOut = () => {
        auth
            .signOut()
            .then(() => {
                setUsername("");
                setUid("");
                navi.replace("Login");
            })
            .catch((error) => alert(error.message));
    };

    const loadContent = () => {
        /* Daten Lesen Methode von: https://firebase.google.com/docs/firestore/query-data/get-data */
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

        const user = firebase.auth().currentUser;
        if (user) {
            console.log("Hallo user mit id: " + user.uid);
            setUid(firebase.auth().currentUser.uid);
            loadContent();
        } else {
            console.log("kein nutzer");
        }
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

        /* setSubjectArray((current) => [
          ...current,
          {
            id: docId,
            grade: grade,
          },
        ]); */



        setSubject();
        console.log(gradesArray);
    };


    const loadGrades = () => {
        db.collection("grades")
            .where("id", "==", docId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setGradesArray((current) => [
                        ...current,
                        {
                            id: docId,
                            grade: doc.data().grade,
                        },
                    ]);
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        console.log(subjectArray);
    }


    const addGrades = (id) => {

        db.collection("grades")
            .add({
                grade: grade,
                uid: uid,
                id: id
            })
            .then((docRef) => {
                setDocIdGrades(docRef.id);
                console.log("GDocument written with Id: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding Gdocument: ", error);
            });

        setGradesArray((current) => [
            ...current,
            {
                id: docId,
                grade: grade,
            },
        ]);


        console.log(gradesArray);
    };




    const renderItem = ({ item }) => (
        console.log(item.id + "blalbalbl"),
        console.log(gradesArray),

        <View style={{ marginBottom: 15 }}>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Text style={{ fontSize: "30", fontweight: "normal", color: "Black" }}>{item.subject}</Text>
                {/* Quelle DialogInput: https://www.nicesnippets.com/blog/how-to-create-alert-with-textinput-in-react-native */}
                <DialogInput
                    isDialogVisible={visible}
                    title={"Gib deine Note ein"}
                    hintInput={"Enter Text"}
                    submitInput={(inputText) => {
                        setGrade(inputText),
                        setVisible(false),

                        addGrades(item.id)
                    }}
                    closeDialog={() => setVisible(false)}>
                </DialogInput>
            </TouchableOpacity>
            <FlatList
                data={gradesArray}
                renderItem={renderItemGrades}
                keyExtractor={(item) => item.id}
                
            />
        </View>
    );



    const renderItemGrades = ({ item }) => (
        loadGrades(),
        <View style={{ marginBottom: 5 }}>
            <Text style={{ fontSize: "25", fontweight: "normal" }}>{item.grade}</Text>
        </View>,
        setGradesArray([])
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
            <Button color="black" title="Abmelden" onPress={SignOut} />
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
        fontFamily: "Trebuchet MS",
        padding: 24,
        flex: 1,
        margin: 20,
        marginTop: 60,
    },
    button: {
        fontFamily: "Trebuchet MS",
        marginTop: 40,
        backgroundColor: "#5DB075",
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

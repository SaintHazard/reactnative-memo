import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});

    useEffect(() => {
        loadToDos();
    }, []);

    const saveToDos = async (toSave) => {
        const toDoJSON = JSON.stringify(toSave);
        await AsyncStorage.setItem(STORAGE_KEY, toDoJSON);
    };

    const loadToDos = async () => {
        const toDoJSON = await AsyncStorage.getItem(STORAGE_KEY);
        setToDos(JSON.parse(toDoJSON));
    };

    const deleteToDo = async (key) => {
        Alert.alert("Delete To Do?", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "I'm sure",
                style: "destructive",
                onPress: async () => {
                    const newToDos = { ...toDos };
                    delete newToDos[key];
                    setToDos(newToDos);
                    await saveToDos(newToDos);
                },
            },
        ]);
    };

    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const onChangeText = (payload) => setText(payload);
    const addToDo = async () => {
        if (text === "") {
            return;
        }

        const newToDos = {
            ...toDos,
            [Date.now()]: { text, working },
        };

        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Pressable onPress={work}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? "white" : theme.gray,
                        }}
                    >
                        Work
                    </Text>
                </Pressable>
                <Pressable onPress={travel}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? theme.gray : "white",
                        }}
                    >
                        Travel
                    </Text>
                </Pressable>
            </View>
            <View>
                <TextInput
                    onSubmitEditing={addToDo}
                    value={text}
                    onChangeText={onChangeText}
                    returnKeyType="done"
                    placeholder={
                        working ? "Add a To Do" : "Where do you want to go?"
                    }
                    style={styles.input}
                />
            </View>
            <ScrollView>
                {Object.keys(toDos).map((key) =>
                    toDos[key].working === working ? (
                        <View style={styles.toDo} key={key}>
                            <Text numberOfLines={0} style={styles.toDoText}>
                                {toDos[key].text}
                            </Text>
                            <Pressable
                                onPress={() => {
                                    deleteToDo(key);
                                }}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={24}
                                    color="orange"
                                />
                            </Pressable>
                        </View>
                    ) : null,
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 20,
    },

    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },

    btnText: {
        fontWeight: "600",
        fontSize: 38,
    },

    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 20,
        fontSize: 18,
    },

    toDo: {
        backgroundColor: theme.toDoBg,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
});

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
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

const STORAGE_TODOS_KEY = "@toDos";
const STORAGE_CURRENT_WORK_KEY = "@working";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    const [update, setUpdate] = useState("");

    useEffect(() => {
        loadWork();
        loadToDos();
    }, []);

    const saveCurrentWork = async (work) => {
        await AsyncStorage.setItem(
            STORAGE_CURRENT_WORK_KEY,
            JSON.stringify(work),
        );
    };

    const loadWork = async () => {
        const savedWorking = await AsyncStorage.getItem(
            STORAGE_CURRENT_WORK_KEY,
        );
        setWorking(JSON.parse(savedWorking));
    };

    const saveToDos = async (toSave) => {
        const toDoJSON = JSON.stringify(toSave);
        await AsyncStorage.setItem(STORAGE_TODOS_KEY, toDoJSON);
    };

    const loadToDos = async () => {
        const toDoJSON = await AsyncStorage.getItem(STORAGE_TODOS_KEY);
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

    const travel = async () => {
        const w = false;
        setWorking(w);
        await saveCurrentWork(w);
    };

    const work = async () => {
        const w = true;
        setWorking(w);
        await saveCurrentWork(w);
    };

    const onDone = async (key) => {
        const newToDos = { ...toDos };
        let currentDone = newToDos[key].done;
        newToDos[key].done = !currentDone;
        setToDos(newToDos);

        await saveToDos(newToDos);
    };

    const onUpdate = (key) => {
        setUpdate(key);
    };

    const onChangeText = (payload) => setText(payload);
    const updateToDoText = async (key, text) => {
        const newToDos = { ...toDos };
        newToDos[key].text = text;

        setToDos(newToDos);
        setUpdate("");

        await saveToDos(newToDos);
    };
    const addToDo = async () => {
        if (text === "") {
            return;
        }

        const key = Date.now();

        const newToDos = {
            ...toDos,
            [key]: { text, working, done: false },
        };

        console.log(newToDos);

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
                            <View style={styles.toDoTextContainer}>
                                {update === key ? (
                                    <TextInput
                                        style={styles.toDoTextInput}
                                        onSubmitEditing={({
                                            nativeEvent: { text },
                                        }) => {
                                            updateToDoText(key, text);
                                        }}
                                    >
                                        {toDos[key].text}
                                    </TextInput>
                                ) : (
                                    <Text
                                        numberOfLines={0}
                                        style={
                                            toDos[key].done === true
                                                ? {
                                                      ...styles.toDoText,
                                                      textDecorationLine:
                                                          "line-through",
                                                  }
                                                : styles.toDoText
                                        }
                                    >
                                        {toDos[key].text}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.accessoryContainer}>
                                <Pressable
                                    onPress={() => {
                                        onDone(key);
                                    }}
                                >
                                    {toDos[key].done === true ? (
                                        <AntDesign
                                            name="checksquare"
                                            size={24}
                                            color="orange"
                                        />
                                    ) : (
                                        <AntDesign
                                            name="checksquareo"
                                            size={24}
                                            color="orange"
                                        />
                                    )}
                                </Pressable>

                                <Pressable
                                    onPress={() => {
                                        update === ""
                                            ? onUpdate(key)
                                            : onUpdate("");
                                    }}
                                >
                                    <Octicons
                                        name="pencil"
                                        size={24}
                                        color="orange"
                                    />
                                </Pressable>
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
        flex: 1,
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

    accessoryContainer: {
        flex: 1.5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 10,
    },

    toDoTextContainer: {
        flex: 3,
    },

    toDoTextInput: {
        backgroundColor: "white",
        color: "black",
        fontSize: 16,
        fontWeight: "500",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

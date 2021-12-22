import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { theme } from './color';

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState('');
    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const onChangeText = (payload) => setText(payload);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <Pressable onPress={work}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? 'white' : theme.gray,
                        }}
                    >
                        Work
                    </Text>
                </Pressable>
                <Pressable onPress={travel}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? theme.gray : 'white',
                        }}
                    >
                        Travel
                    </Text>
                </Pressable>
            </View>
            <View>
                <TextInput
                    value={text}
                    onTextInput={onChangeText}
                    placeholder={
                        working ? 'Add a To Do' : 'Where do you want to go?'
                    }
                    style={styles.input}
                />
            </View>
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 100,
    },

    btnText: {
        fontWeight: '600',
        fontSize: 38,
    },

    input: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
        fontSize: 18,
    },
});

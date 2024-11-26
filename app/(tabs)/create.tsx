import {StyleSheet, Image, Platform, TextInput} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {IconSymbol} from '@/components/ui/IconSymbol';
import {useState} from "react";
import {Button} from 'react-native-paper';
import {createDest} from "@/api/apiUtils";


export default function TabTwoScreen() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [difficulty, setDifficulty] = useState('')


    const handleCreateDestination = () => {
        createDest(name, description, difficulty)
    }


    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
            headerImage={
                <Image
                    source={require('@/assets/images/grancanon.png')}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Nuevo destino:</ThemedText>
            </ThemedView>
            <TextInput
                style={styles.textInput}
                placeholder="Nombre"
                onChangeText={text => setName(text)}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Descripción"
                onChangeText={text => setDescription(text)}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Dificultad (easy, medium, hard)"
                onChangeText={text => setDifficulty(text)}
            />
            <Button
                onPress={() => {
                    handleCreateDestination()
                }}
                mode="outlined"
                style={styles.button}
            >
                Crear destino
            </Button>


        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    textInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 8,
        margin: 8,
    },
    button: {
        margin: 8,
        // width: '50%',
    }
});

import {Image, StyleSheet, View, TouchableOpacity, TextInput} from 'react-native';
import axios from "axios";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useEffect, useState} from "react";
import {baseUrl} from "@/constants/Utils";
import {Destination} from "@/interfaces/destination";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {addFav, editDest} from "@/api/apiUtils";
import {Modal, Portal, Text, Button, PaperProvider} from 'react-native-paper';
import {Provider} from "react-redux";
import store from "@/store/store";

export default function HomeScreen() {
    const [destinos, setDestinos] = useState([])
    const [destinosCargados, setDestinosCargados] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [destinoAEditar, setDestinoAEditar] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [difficulty, setDifficulty] = useState('')

    const showModal = () => {
        setModalVisible(true)
    };
    const hideModal = () => setModalVisible(false);

    useEffect(() => {
        setDestinosCargados(false)
        if (!destinosCargados) {
            console.log("Cargando destinos...")
            axios.get(baseUrl)
                .then(response => {
                    setDestinos(response.data)
                    console.log("Destinos cargados:", response.data)
                    setDestinosCargados(true)
                })
                .catch(error => {
                    console.error("Error al cargar los destinos:", error)
                })
        }
    }, [])

    const handleFavorite = (id: string) => {
        const destino: Destination = destinos.find((destino: Destination) => destino.id === id)
        if (destino) {
            destino.favourite = !destino.favourite
            setDestinos([...destinos])
            addFav(id, destino.favourite)
        }
    }

    const handleEdit = () => {
        editDest(destinoAEditar, name, description, difficulty)
    }

    if (destinos.length > 0) {

        const mostrarDestinos = () => {
            destinos.sort((a: Destination, b: Destination) => {
                return a.name.localeCompare(b.name)
            })
            destinos.sort((a: Destination, b: Destination) => {
                return a.favourite === b.favourite ? 0 : a.favourite ? -1 : 1
            })
            return destinos.map((destino: Destination) => {
                return (
                    <ThemedView key={destino.id}
                                style={styles.destinationContainer}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setDestinoAEditar(destino.id)
                                setName(destino.name)
                                setDescription(destino.description)
                                setDifficulty(destino.difficulty)
                                showModal()
                            }}
                        >
                            <ThemedText type="subtitle">{destino.name}</ThemedText>
                            <ThemedText type="body"
                                        style={{
                                            color: destino.difficulty === 'easy' ? 'green' : destino.difficulty === 'medium' ? 'orange' : 'purple'
                                        }}
                            >{destino.difficulty.toUpperCase()}</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleFavorite(destino.id)}
                        >
                            {destino.favourite ? <MaterialIcons name="favorite" size={24} color="red"/> :
                                <MaterialIcons name="favorite-border" size={24} color="black"/>}
                        </TouchableOpacity>
                    </ThemedView>
                )
            })
        }

        return (
            // <Provider store={store}>
            <PaperProvider>
                <ParallaxScrollView
                    headerBackgroundColor={{light: '#A1CEDC', dark: '#1D3D47'}}
                    headerImage={
                        <Image
                            source={require('@/assets/images/beach.png')}
                        />
                    }>
                    <Portal>
                        <Modal visible={modalVisible}
                               onDismiss={hideModal}
                               style={styles.modal}
                        >
                            <TextInput
                                style={styles.textInput}
                                placeholder="Nombre"
                                value={name}
                                onChangeText={text => setName(text)}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Descripción"
                                value={description}
                                onChangeText={text => setDescription(text)}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Dificultad (easy, medium, hard)"
                                value={difficulty}
                                onChangeText={text => setDifficulty(text)}
                            />
                            <View style={styles.buttonContainer}>
                                <Button
                                    onPress={() => {
                                        handleEdit()
                                        hideModal()
                                    }}
                                    mode="outlined"
                                    style={styles.button}
                                >
                                    Confirmar </Button>
                                <Button
                                    onPress={() => {
                                        // handleCreateDestination()
                                    }}
                                    mode="outlined"
                                    style={styles.button}
                                >
                                    Eliminar
                                </Button>
                            </View>
                        </Modal>
                    </Portal>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type="title">Estos son los destinos que ofrecemos:</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.stepContainer}>
                        {mostrarDestinos()}
                    </ThemedView>
                </ParallaxScrollView>
            </PaperProvider>
            // </Provider>
        );
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    destinationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderRadius: 8,
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        marginTop: '50%',
        borderRadius: 20,
        height: '45%',
    },
    textInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 8,
        margin: '5%',
    },
    button: {
        margin: '5%',
        width: '40%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    }

});

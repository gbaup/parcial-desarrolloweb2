import {Image, StyleSheet, View, TouchableOpacity, TextInput, Platform} from 'react-native';
import axios from "axios";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import React, {useContext, useEffect, useState} from "react";
import {baseUrl} from "@/constants/Utils";
import {Destination} from "@/interfaces/destination";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {addFav, editDest, deleteDest} from "@/api/apiUtils";
import {Modal, Portal, Text, Button, PaperProvider} from 'react-native-paper';
import {DestinosContext} from "@/context/destinosContext";
import {useFocusEffect} from "expo-router";
import {AntDesign} from "@expo/vector-icons";

export default function HomeScreen() {
    const [destinosCargados, setDestinosCargados] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [destinoAEditar, setDestinoAEditar] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [difficulty, setDifficulty] = useState('')

    const {destinos, setDestinos} = useContext(DestinosContext);

    if (Platform.OS === 'ios') {
        console.log("Estás en iOS");
    } else if (Platform.OS === 'android') {
        console.log("Estás en Android");
    }

    const showModal = () => {
        setModalVisible(true)
    };
    const hideModal = () => setModalVisible(false);

    useFocusEffect(
        React.useCallback(() => {
            setDestinosCargados(false);
            console.log("Cargando destinos...");
            axios.get(baseUrl)
                .then(response => {
                    setDestinos(response.data);
                    console.log("Destinos cargados:", response.data);
                    setDestinosCargados(true);
                })
                .catch(error => {
                    console.error("Error al cargar los destinos:", error);
                });
        }, [setDestinos])
    );


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
            .then(() => {
                setDestinos((prevDestinos) => {
                    return prevDestinos.map(destino =>
                        destino.id === destinoAEditar
                            ? {...destino, name, description, difficulty}
                            : destino
                    );
                });
                hideModal();
            })
            .catch(error => console.error('Error al editar el destino:', error));
    };

    const handleDelete = (id) => {
        deleteDest(id)
            .then(() => {
                setDestinos((prevDestinos) => {
                    return prevDestinos.filter(destino => destino.id !== id);
                });
                hideModal();
            })
            .catch(error => console.error('Error al eliminar el destino:', error));
    };


    if (destinos.length > 0) {

        const mostrarDestinos = () => {
            if (!destinos || destinos.length === 0) {
                return <ThemedText type="body">No hay destinos disponibles.</ThemedText>;
            }

            return destinos
                .filter((destino) => destino) // Filtrar elementos `undefined`
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => (a.favourite === b.favourite ? 0 : a.favourite ? -1 : 1))
                .map((destino) => (
                    <ThemedView key={destino.id} style={styles.destinationContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setDestinoAEditar(destino.id);
                                setName(destino.name);
                                setDescription(destino.description);
                                setDifficulty(destino.difficulty);
                                showModal();
                            }}
                        >
                            <ThemedText type="subtitle">{destino.name}</ThemedText>
                            <ThemedText
                                type="body"
                                style={{
                                    color:
                                        destino.difficulty === 'easy'
                                            ? 'green'
                                            : destino.difficulty === 'medium'
                                                ? 'orange'
                                                : 'purple',
                                }}
                            >
                                {destino.difficulty.toUpperCase()}
                            </ThemedText>
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && (<TouchableOpacity onPress={() => handleFavorite(destino.id)}>
                            {destino.favourite ? (
                                <MaterialIcons name="favorite" size={24} color="red"/>
                            ) : (
                                <MaterialIcons name="favorite-border" size={24} color="black"/>
                            )}
                        </TouchableOpacity>)}
                        {Platform.OS === 'android' && (
                            <TouchableOpacity onPress={() => handleFavorite(destino.id)}>
                                {destino.favourite ? (
                                    <AntDesign name="star" size={24} color="orange"/>) : (
                                    <AntDesign name="staro" size={24} color="black"/>)}
                            </TouchableOpacity>
                        )}
                    </ThemedView>
                ));
        };


        return (
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
                                        handleDelete(destinoAEditar)
                                        hideModal()
                                    }}
                                    mode="outlined"
                                    textColor={'red'}
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

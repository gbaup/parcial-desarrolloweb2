import {baseUrl} from "@/constants/Utils";
import axios from "axios";
import {Destination} from "@/interfaces/destination";

export const addFav = async (id: number, favourite: boolean) => {
    const url = baseUrl + id
    console.log(url)
    try {
        await axios.patch(url, {favourite})
        console.log("Añadido a favoritos:", id)
    } catch (error) {
        console.error("Error al añadir a favoritos:", error)
    }
}


export const createDest = async (name: string, description: string, difficulty: string) => {
    const url = baseUrl
    const dificultad = difficulty.toLowerCase()
    if (!name || !description || !difficulty) {
        console.error("Faltan datos")
    } else if (dificultad !== 'easy' && dificultad !== 'medium' && dificultad !== 'hard') {
        console.error("Dificultad incorrecta")
    } else {
        try {
            const destination: Destination = {
                name,
                description,
                difficulty: dificultad,
                favourite: false
            }
            await axios.post(url, destination)
            console.log("Destino creado:", name)
        } catch (error) {
            console.error("Error al crear destino:", error)
        }
    }
}

export const editDest = async (id: number, name: string, description: string, difficulty: string) => {
    const url = baseUrl + id
    const dificultad = difficulty.toLowerCase()
    if (!name || !description || !difficulty) {
        console.error("Faltan datos")
    } else if (dificultad !== 'easy' && dificultad !== 'medium' && dificultad !== 'hard') {
        console.error("Dificultad incorrecta")
    } else {
        try {
            const destination: Destination = {
                name,
                description,
                difficulty: dificultad,
                favourite: false
            }
            await axios.put(url, destination)
            console.log("Destino editado:", name)
        } catch (error) {
            console.error("Error al editar destino:", error)
        }
    }
}
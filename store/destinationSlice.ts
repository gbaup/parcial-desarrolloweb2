import {createSlice} from '@reduxjs/toolkit';

const destinationSlice = createSlice({
    name: 'destination',
    initialState: [],
    reducers: {
        addItem: (state, action) => {
            state.push(action.payload); // Agregar un elemento al array
        },
        removeItem: (state, action) => {
            return state.filter((item, index) => index !== action.payload); // Eliminar un elemento por índice
        },
        clearArray: () => {
            return []; // Vaciar el array
        },
    },
});

export const {addItem, removeItem, clearArray} = destinationSlice.actions;

export default destinationSlice.reducer;
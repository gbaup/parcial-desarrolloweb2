import {configureStore} from '@reduxjs/toolkit';
import destinationSlice from './destinationSlice';

const store = configureStore({
    reducer: {
        destination: destinationSlice,
    },
});

export default store;
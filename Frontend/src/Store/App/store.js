import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Features/Auth/authSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;


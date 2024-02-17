import {configureStore} from "@reduxjs/toolkit";
import proyectoReducer from "./slices/proyectoSlice.js";
import fraccionReducer from "./slices/fraccionSlice.js";
import generalSlice from "./slices/generalSlice.js";
import cotaSlice from "./slices/cotaSlice.js";
import operacionSlice from "./slices/operacionSlice.js";

const store = configureStore({
    reducer: {
        general: generalSlice,
        proyectos: proyectoReducer,
        fracciones: fraccionReducer,
        cotas: cotaSlice,
        operaciones: operacionSlice
    },
    devTools: true
})

export default store;
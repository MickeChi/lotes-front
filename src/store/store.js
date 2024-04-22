import {configureStore} from "@reduxjs/toolkit";
import proyectoReducer from "./slices/proyectoSlice.js";
import unidadReducer from "./slices/unidadSlice.js";
import generalSlice from "./slices/generalSlice.js";
import cotaSlice from "./slices/cotaSlice.js";
import operacionSlice from "./slices/operacionSlice.js";

const store = configureStore({
    reducer: {
        general: generalSlice,
        proyectos: proyectoReducer,
        unidades: unidadReducer,
        cotas: cotaSlice,
        operaciones: operacionSlice
    },
    devTools: true
})

export default store;
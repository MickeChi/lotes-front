import {configureStore} from "@reduxjs/toolkit";
import proyectoReducer from "./slices/proyectoSlice.js";
import fraccionReducer from "./slices/fraccionSlice.js";
import generalSlice from "./slices/generalSlice.js";
import cotaSlice from "./slices/cotaSlice.js";

const store = configureStore({
    reducer: {
        general: generalSlice,
        proyectos: proyectoReducer,
        fracciones: fraccionReducer,
        cotas: cotaSlice
    },
    devTools: true
})

export default store;
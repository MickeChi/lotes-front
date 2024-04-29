import {configureStore} from "@reduxjs/toolkit";
import proyectoReducer from "./slices/proyectoSlice.js";
import unidadReducer from "./slices/unidadSlice.js";
import generalSlice from "./slices/generalSlice.js";
import cotaSlice from "./slices/cotaSlice.js";
import operacionSlice from "./slices/operacionSlice.js";
import colindanciaSlice from "./slices/colindanciaSlice.js";
import catalogoSlice from "./slices/catalogoSlice.js";

const store = configureStore({
    reducer: {
        general: generalSlice,
        proyectos: proyectoReducer,
        unidades: unidadReducer,
        cotas: cotaSlice,
        colindancias: colindanciaSlice,
        operaciones: operacionSlice,
        catalogos: catalogoSlice
    },
    devTools: true
})

export default store;
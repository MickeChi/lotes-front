import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import CatalogosService from "../../services/CatalogosService.js";

const initialState = {
    tiposDesarrollos: [],
    usos: [],
    tiposUnidades: []
}


export const getTiposDesarrollos = createAsyncThunk(
    "catalogos/tiposDesarrollos",
    async (request) => {
        const res = await CatalogosService.getTiposDesarrollos(request);
        return res.data;
    }
);

export const getUsos = createAsyncThunk(
    "catalogos/usos",
    async (request) => {
        const res = await CatalogosService.getUsos(request);
        return res.data;
    }
);

export const getTiposUnidades = createAsyncThunk(
    "catalogos/tiposUnidades",
    async (request) => {
        const res = await CatalogosService.getTiposUnidades(request);
        return res.data;
    }
);


const catalogoSlice = createSlice({
    name: "catalogos",
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            .addCase(getTiposDesarrollos.fulfilled, (state, action) => {
                state.tiposDesarrollos = action.payload;
            })
            .addCase(getTiposUnidades.fulfilled, (state, action) => {
                state.tiposUnidades = action.payload;
            })
            .addCase(getUsos.fulfilled, (state, action) => {
                state.usos = action.payload;
            })
    }

})

const { reducer } = catalogoSlice;
export default reducer;

//export const {setCotaActivo, setCotas} = catalogoSlice.actions;
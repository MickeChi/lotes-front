import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import CatalogosService from "../../services/CatalogosService.js";

const initialState = {
    tiposDesarrollos: [],
}


export const getTiposDesarrollos = createAsyncThunk(
    "catalogos/tiposDesarrollos",
    async (request) => {
        const res = await CatalogosService.getTiposDesarrollos(request);
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
    }

})

const { reducer } = catalogoSlice;
export default reducer;

//export const {setCotaActivo, setCotas} = catalogoSlice.actions;
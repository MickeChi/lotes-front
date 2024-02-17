import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import OperacionService from "../../services/OperacionService.js";

const initialState = {
    indicadores: [],
    operaciones: [],
}

export const getOperaciones = createAsyncThunk(
    "operaciones/getAll",
    async (request) => {
        const res = await OperacionService.getAll(request);
        return res.data;
    }
);

export const getIndicadores = createAsyncThunk(
    "operaciones/getIndicadores",
    async (request) => {
        const res = await OperacionService.getIndicadores(request);
        return res.data;
    }
);

const operacionSlice = createSlice({
    name: "operaciones",
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
            .addCase(getOperaciones.fulfilled,  (state, action) => {
                state.operaciones.push(action.payload);
            })
            .addCase(getIndicadores.fulfilled, (state, action) => {
                state.indicadores = action.payload;

            })
    }

})

const { reducer } = operacionSlice;
export default reducer;

//export const {setCotaActivo, setCotas} = operacionSlice.actions;
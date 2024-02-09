import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import EstadoService from "../../services/EstadoService.js";
import MunicipiosService from "../../services/MunicipiosService.js";

const initialState = {
    loader: false,
    estados: [],
    municipios: []
}

export const getAllNamesEstados = createAsyncThunk(
    "estados/getAllNames",
    async (request) => {
        const res = await EstadoService.getAllNames(request);
        return res;
    }
);

export const getAllNamesMunicipiosByEstado = createAsyncThunk(
    "municipios/getAllNames",
    async (request) => {
        const res = await MunicipiosService.getNamesByEstadoNombre(request);
        return res;
    }
);


const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers:{
        setLoader: (state, action) => {
            return {
                ...state,
                loader: action.payload
            }
        },
        setMunicipios: (state, action) => {
            return {
                ...state,
                municipios: action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllNamesEstados.fulfilled,  (state, action) => {
                state.estados = action.payload;
            })
            .addCase(getAllNamesMunicipiosByEstado.fulfilled, (state, action) => {
                state.municipios = action.payload;

            })
    }

})

const { reducer } = generalSlice;
export default reducer;
export const {setLoader, setMunicipios} = generalSlice.actions;
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ArchivoService from "../../services/ArchivoService.js";

const initialState = {
    archivos: [],
    archivoActivo: null,
}

export const createArchivo = createAsyncThunk(
    "archivos/create",
    async (request) => {
        const res = await ArchivoService.create(request);
        return res.data;
    }
);

export const getAllArchivos = createAsyncThunk(
    "archivos/getAll",
    async (request) => {
        const res = await ArchivoService.getAll(request);
        return res.data;
    }
);

export const updateArchivo = createAsyncThunk(
    "archivos/update",
    async (request) => {
        const res = await ArchivoService.update(request);
        return res.data;
    }
);

export const deleteArchivo = createAsyncThunk(
    "archivos/delete",
    async ({ id }) => {
        const res = await ArchivoService.remove(id);
        return res.data;
    }
);

export const setArchivoActivoById = createAsyncThunk(
    "archivos/findById",
    async ({ id }) => {
        const res = await ArchivoService.getById(id);
        return res.data;
    }
);

const cotaSlice = createSlice({
    name: "archivos",
    initialState,
    reducers:{
        setArchivoActivo: (state, action) => {
            return {
                ...state,
                archivoActivo: action.payload
            }
        },
        setArchivos: (state, action) => {
            return {
                ...state,
                archivos: action.payload
            }
        },
        addArchivo: (state, action) => {

            let existId = state.archivos.find(a => a.id === action.payload.id);
            if(existId === undefined){
                state.archivos.push(action.payload);
            }
            return state;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(createArchivo.fulfilled,  (state, action) => {
                state.archivos.push(action.payload);
            })
            .addCase(getAllArchivos.fulfilled, (state, action) => {
                state.archivos = action.payload;

            })
            .addCase(updateArchivo.fulfilled, (state, action) => {
                const archivosUp = state.archivos.map(p=>{
                    if(p.id === action.payload.id)
                        p = {...p, ...action.payload}
                    return p;
                })
                state.archivos = archivosUp
            })
            .addCase(deleteArchivo.fulfilled, (state, action) => {
                const archivosUp = state.archivos.filter(p=> p.id !== action.payload.id)
                state.archivos = archivosUp;
            })
            .addCase(setArchivoActivoById.fulfilled, (state, action) => {
                state.archivoActivo = action.payload
            })
    }

})

const { reducer } = cotaSlice;
export default reducer;

export const {setArchivoActivo, setArchivos, addArchivo} = cotaSlice.actions;
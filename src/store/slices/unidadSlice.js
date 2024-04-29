import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import UnidadService from "../../services/UnidadService.js";

const initialState = {
    unidades: [],
    unidadActivo: null,
}

export const createUnidad = createAsyncThunk(
    "unidades/create",
    async (request) => {
        const res = await UnidadService.create(request);
        return res.data;
    }
);

export const getAllUnidades = createAsyncThunk(
    "unidades/getAll",
    async (request) => {
        const res = await UnidadService.getAll(request);
        return res.data;
    }
);

export const updateUnidad = createAsyncThunk(
    "unidades/update",
    async (request) => {
        const res = await UnidadService.update(request);
        return res.data;
    }
);

export const deleteUnidad = createAsyncThunk(
    "unidades/delete",
    async ({ id }) => {
        const res = await UnidadService.remove(id);
        return res.data;
    }
);

export const setUnidadActivoById = createAsyncThunk(
    "unidades/findById",
    async ({ id }) => {
        const res = await UnidadService.getById(id);
        return res.data;
    }
);

const unidadSlice = createSlice({
    name: "unidades",
    initialState,
    reducers:{
        setUnidadActivo: (state, action) => {
            return {
                ...state,
                unidadActivo: action.payload
            }
        },
        addCotaUnidad: (state, action) => {
            const unidadesUp = state.unidades.map(p=>{
                if(p.id === action.payload.unidadId){
                    p = {...p, cotas: [...p.cotas, action.payload]}
                }
                return p;
            })

            return {
                ...state,
                unidades: unidadesUp
            }
        },

        removeCotaUnidad: (state, action) => {
            const unidadesUp = state.unidades.map(p=>{
                console.log("removeCotaUnidad action: ", action.payload);
                if(p.id === action.payload.unidadId){
                    console.log("removeCotaUnidad action del: ", action.payload);
                    let cotasFil = p.cotas.filter(c => c.id !== action.payload.id);
                    console.log("removeCotaUnidad cotasFil: ", cotasFil);

                    p = {...p, cotas: cotasFil}
                }
                return p;
            })

            return {
                ...state,
                unidades: unidadesUp
            }
        }


    },
    extraReducers: (builder) => {
        builder
            .addCase(createUnidad.fulfilled,  (state, action) => {
                state.unidades.push(action.payload);
            })
            .addCase(getAllUnidades.fulfilled, (state, action) => {
                state.unidades = action.payload;

            })
            .addCase(updateUnidad.fulfilled, (state, action) => {
                const proysUp = state.unidades.map(p=>{
                    if(p.id === action.payload.id)
                        p = {...p, ...action.payload}
                    return p;
                })
                state.unidades = proysUp
            })
            .addCase(deleteUnidad.fulfilled, (state, action) => {
                const proysUp = state.unidades.filter(p=> p.id !== action.payload.id);
                state.unidades = proysUp
            })
            .addCase(setUnidadActivoById.fulfilled, (state, action) => {
                state.unidadActivo = action.payload
            })
    }

})

const { reducer } = unidadSlice;
export default reducer;

export const {setUnidadActivo,  addCotaUnidad, removeCotaUnidad} = unidadSlice.actions;
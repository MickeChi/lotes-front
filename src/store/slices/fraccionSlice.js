import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import FraccionService from "../../services/FraccionService.js";

const initialState = {
    fracciones: [],
    fraccionActivo: null,
}

export const createFraccion = createAsyncThunk(
    "fracciones/create",
    async (request) => {
        const res = await FraccionService.create(request);
        return res.data;
    }
);

export const getAllFracciones = createAsyncThunk(
    "fracciones/getAll",
    async (request) => {
        const res = await FraccionService.getAll(request);
        return res.data;
    }
);

export const updateFraccion = createAsyncThunk(
    "fracciones/update",
    async (request) => {
        const res = await FraccionService.update(request);
        return res.data;
    }
);

export const deleteFraccion = createAsyncThunk(
    "fracciones/delete",
    async ({ id }) => {
        await FraccionService.remove(id);
        return { id };
    }
);

export const setFraccionActivoById = createAsyncThunk(
    "fracciones/findById",
    async ({ id }) => {
        const res = await FraccionService.getById(id);
        return res.data;
    }
);

const fraccionSlice = createSlice({
    name: "fracciones",
    initialState,
    reducers:{
        setFraccionActivo: (state, action) => {
            return {
                ...state,
                fraccionActivo: action.payload
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(createFraccion.fulfilled,  (state, action) => {
                state.fracciones.push(action.payload);
            })
            .addCase(getAllFracciones.fulfilled, (state, action) => {
                state.fracciones = action.payload;

            })
            .addCase(updateFraccion.fulfilled, (state, action) => {
                const proysUp = state.fracciones.map(p=>{
                    if(p.id === action.payload.id)
                        p = {...p, ...action.payload}
                    return p;
                })
                state.fracciones = proysUp
            })
            .addCase(deleteFraccion.fulfilled, (state, action) => {
                let index = state.findIndex(({id}) => id === action.payload.id);
                state.splice(index, 1);
            })
            .addCase(setFraccionActivoById.fulfilled, (state, action) => {
                state.fraccionActivo = action.payload
            })
    }

})

const { reducer } = fraccionSlice;
export default reducer;
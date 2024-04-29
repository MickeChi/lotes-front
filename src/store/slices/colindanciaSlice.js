import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ColindanciaService from "../../services/ColindanciaService.js";

const initialState = {
    colindancias: [],
    colindanciaActivo: null,
}

export const createColindancia = createAsyncThunk(
    "colindancias/create",
    async (request) => {
        const res = await ColindanciaService.create(request);
        return res.data;
    }
);

export const getAllColindancias = createAsyncThunk(
    "colindancias/getAll",
    async (request) => {
        const res = await ColindanciaService.getAll(request);
        return res.data;
    }
);

export const updateColindancia = createAsyncThunk(
    "colindancias/update",
    async (request) => {
        const res = await ColindanciaService.update(request);
        return res.data;
    }
);

export const deleteColindancia = createAsyncThunk(
    "colindancias/delete",
    async ({ id }) => {
        const res = await ColindanciaService.remove(id);
        return res.data;
    }
);

export const setColindanciaActivoById = createAsyncThunk(
    "colindancias/findById",
    async ({ id }) => {
        const res = await ColindanciaService.getById(id);
        return res.data;
    }
);

const colindanciaSlice = createSlice({
    name: "colindancias",
    initialState,
    reducers:{
        setColindanciaActivo: (state, action) => {
            return {
                ...state,
                colindanciaActivo: action.payload
            }
        },
        setColindancias: (state, action) => {
            return {
                ...state,
                colindancias: action.payload
            }
        },
        addColindanciaCota: (state, action) => {
            return {
                ...state,
                colindancias: [...state.colindancias, action.payload]
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(createColindancia.fulfilled,  (state, action) => {
                state.colindancias.push(action.payload);
            })
            .addCase(getAllColindancias.fulfilled, (state, action) => {
                state.colindancias = action.payload;

            })
            .addCase(updateColindancia.fulfilled, (state, action) => {
                const colindanciasUp = state.colindancias.map(p=>{
                    if(p.id === action.payload.id)
                        p = {...p, ...action.payload}
                    return p;
                })
                state.colindancias = colindanciasUp
            })
            .addCase(deleteColindancia.fulfilled, (state, action) => {
                const colindanciasUp = state.colindancias.filter(p=> p.id !== action.payload.id)
                state.colindancias = colindanciasUp;
            })
            .addCase(setColindanciaActivoById.fulfilled, (state, action) => {
                state.colindanciaActivo = action.payload
            })
    }

})

const { reducer } = colindanciaSlice;
export default reducer;

export const {setColindanciaActivo, setColindancias, addColindanciaCota} = colindanciaSlice.actions;
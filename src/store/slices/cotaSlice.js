import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import CotaService from "../../services/CotaService.js";

const initialState = {
    cotas: [],
    cotasSinColindancia: [],
    cotaActivo: null,
}

export const createCota = createAsyncThunk(
    "cotas/create",
    async (request) => {
        const res = await CotaService.create(request);
        return res.data;
    }
);

export const getAllCotas = createAsyncThunk(
    "cotas/getAll",
    async (request) => {
        const res = await CotaService.getAll(request);
        return res.data;
    }
);

export const updateCota = createAsyncThunk(
    "cotas/update",
    async (request) => {
        const res = await CotaService.update(request);
        return res.data;
    }
);

export const deleteCota = createAsyncThunk(
    "cotas/delete",
    async ({ id }) => {
        const res = await CotaService.remove(id);
        return res.data;
    }
);

export const setCotaActivoById = createAsyncThunk(
    "cotas/findById",
    async ({ id }) => {
        const res = await CotaService.getById(id);
        return res.data;
    }
);

export const getCotasSinColindancia = createAsyncThunk(
    "cotas/getCotasSinColindancia",
    async (request) => {
        const res = await CotaService.getAll(request);
        return res.data;
    }
);

const cotaSlice = createSlice({
    name: "cotas",
    initialState,
    reducers:{
        setCotaActivo: (state, action) => {
            return {
                ...state,
                cotaActivo: action.payload
            }
        },
        setCotas: (state, action) => {
            return {
                ...state,
                cotas: action.payload
            }
        },
        setCotasSinColindancia: (state, action) => {
            return {
                ...state,
                cotasSinColindancia: action.payload
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(createCota.fulfilled,  (state, action) => {
                state.cotas.push(action.payload);
            })
            .addCase(getAllCotas.fulfilled, (state, action) => {
                state.cotas = action.payload;

            })
            .addCase(updateCota.fulfilled, (state, action) => {
                const cotasUp = state.cotas.map(p=>{
                    if(p.id === action.payload.id)
                        p = {...p, ...action.payload}
                    return p;
                })
                state.cotas = cotasUp
            })
            .addCase(deleteCota.fulfilled, (state, action) => {
                const cotasUp = state.cotas.filter(p=> p.id !== action.payload.id)
                state.cotas = cotasUp;
            })
            .addCase(setCotaActivoById.fulfilled, (state, action) => {
                state.cotaActivo = action.payload
            })
            .addCase(getCotasSinColindancia.fulfilled, (state, action) => {
                state.cotasSinColindancia = action.payload;
            })
    }

})

const { reducer } = cotaSlice;
export default reducer;

export const {setCotaActivo, setCotas, setCotasSinColindancia} = cotaSlice.actions;
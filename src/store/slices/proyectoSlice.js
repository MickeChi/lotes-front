import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ProyectoService from "../../services/ProyectoService.js";

const initialState = {
    proyectos: [],
    proyectoActivo: null,
}

export const createProyecto = createAsyncThunk(
    "proyectos/create",
    async (request) => {
        const res = await ProyectoService.create(request);
        return res.data;
    }
);

export const getAllProyectos = createAsyncThunk(
    "proyectos/getAll",
    async (request) => {
        const res = await ProyectoService.getAll(request);
        return res.data;
    }
);

export const updateProyecto = createAsyncThunk(
    "proyectos/update",
    async (request) => {
        const res = await ProyectoService.update(request);
        return res.data;
    }
);

export const deleteProyecto = createAsyncThunk(
    "proyectos/delete",
    async ({ id }) => {
        await ProyectoService.remove(id);
        return { id };
    }
);

export const setProyectoActivoById = createAsyncThunk(
    "proyectos/findById",
    async ({ id }) => {
        const res = await ProyectoService.getById(id);
        return res.data;
    }
);

const proyectoSlice = createSlice({
    name: "proyectos",
    initialState,
    reducers:{
        setProyectoActivo: (state, action) => {
            return {
                ...state,
                proyectoActivo: action.payload
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(createProyecto.fulfilled,  (state, action) => {
                state.proyectos.push(action.payload);
            })
            .addCase(getAllProyectos.fulfilled, (state, action) => {
                state.proyectos = action.payload;

            })
            .addCase(updateProyecto.fulfilled, (state, action) => {
                const proysUp = state.proyectos.map(p=>{
                    if(p.id === action.payload.id)
                        p = {...p, ...action.payload}
                    return p;
                })
                state.proyectos = proysUp
            })
            .addCase(deleteProyecto.fulfilled, (state, action) => {
                let index = state.findIndex(({id}) => id === action.payload.id);
                state.splice(index, 1);
            })
            .addCase(setProyectoActivoById.fulfilled, (state, action) => {
                state.proyectoActivo = action.payload
            })
    }

})

const { reducer } = proyectoSlice;
export default reducer;
import axiosClient from "../utils/axiosClient.js";

const getAll = (request) =>{
    return axiosClient.get(`proyecto`, {
        params: request
    });
}

const getById = (id) => {
    return axiosClient.get(`proyecto/${id}`);
}

const update = (request) => {
    return axiosClient.put(`proyecto/${request.id}`, request);
}

const create = (request) => {
    return axiosClient.post(`proyecto`, request);
}

const remove = (id) => {
    return axiosClient.get(`proyecto/${id}`);
}

const getFraccionesDoc = (id) => {
    return axiosClient.get(`proyecto/generate-fracciones-doc/${id}`);
}

const ProyectoService = {
    getAll,
    getById,
    update,
    create,
    remove,
    getFraccionesDoc
}

export default ProyectoService;

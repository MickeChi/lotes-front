import axiosClient from "../utils/axiosClient.js";

const getAll = (request) => {
    return axiosClient.get(`colindancia`, {
        params: request
    });
}

const getById = (id) => {
    return axiosClient.get(`colindancia/${id}`);
}

const update = (request) => {
    return axiosClient.put(`colindancia/${request.id}`, request);
}

const create = (request) => {
    return axiosClient.post(`colindancia`, request);
}

const remove = (id) => {
    return axiosClient.delete(`colindancia/${id}`);
}

const ColindanciaService =  {
    getAll,
    getById,
    update,
    create,
    remove
}

export default ColindanciaService;

import axiosClient from "../utils/axiosClient.js";

const getAll = (request) => {
    return axiosClient.get(`cota`, {
        params: request
    });
}

const getById = (id) => {
    return axiosClient.get(`cota/${id}`);
}

const update = (request) => {
    return axiosClient.put(`cota/${request.id}`, request);
}

const create = (request) => {
    return axiosClient.post(`cota`, request);
}

const remove = (id) => {
    return axiosClient.delete(`cota/${id}`);
}

const CotaService =  {
    getAll,
    getById,
    update,
    create,
    remove
}

export default CotaService;

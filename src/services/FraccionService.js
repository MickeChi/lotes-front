import axiosClient from "../utils/axiosClient.js";

const getAll = (request) => {
    return axiosClient.get(`fraccion`, {
        params: request
    });
}

const getById = (id) => {
    return axiosClient.get(`fraccion/${id}`);
}

const update = (request) => {
    return axiosClient.put(`fraccion/${request.id}`, request);
}

const create = (request) => {
    return axiosClient.post(`fraccion`, request);
}

const remove = (id) => {
    return axiosClient.delete(`fraccion/${id}`);
}

const FraccionService =  {
    getAll,
    getById,
    update,
    create,
    remove
}

export default FraccionService;

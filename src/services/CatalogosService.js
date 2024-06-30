import axiosClient from "../utils/axiosClient.js";

const getTiposDesarrollos = (request) => {
    return axiosClient.get(`catalogos/tipos-desarrollos`, {
        params: request
    });
}

const getUsos = (request) => {
    return axiosClient.get(`catalogos/usos`, {
        params: request
    });
}

const getTiposUnidades = (request) => {
    return axiosClient.get(`catalogos/tipos-unidades`, {
        params: request
    });
}



const CotalogosService =  {
    getTiposDesarrollos,
    getUsos,
    getTiposUnidades
}

export default CotalogosService;

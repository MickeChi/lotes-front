import axiosClient from "../utils/axiosClient.js";

const getAll = (request) => {
    return axiosClient.get(`operacion`, {
        params: request
    });
}

const getIndicadores = (request) => {
    return axiosClient.get(`operacion/indicadores`, {
        params: request
    });
}

const OperacionService =  {
    getAll,
    getIndicadores
}

export default OperacionService;

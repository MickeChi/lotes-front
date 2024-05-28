import axiosClient from "../utils/axiosClient.js";

const getTiposDesarrollos = (request) => {
    return axiosClient.get(`catalogos/tipos-desarrollos`, {
        params: request
    });
}


const CotalogosService =  {
    getTiposDesarrollos
}

export default CotalogosService;

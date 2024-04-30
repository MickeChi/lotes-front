import axiosClient from "../utils/axiosClient.js";

const getAll = (request) => {
    return axiosClient.get(`unidad`, {
        params: request
    });
}

const getById = (id) => {
    return axiosClient.get(`unidad/${id}`);
}

const update = (request) => {
    //return axiosClient.put(`unidad/${request.id}`, request);
    let formData = generateRequest(request);
    console.log("generateReques t update", formData);
    return axiosClient.put(`unidad/${request.id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

const create = (request) => {
    let formData = generateRequest(request);
    console.log("generateReques t create", formData);
    return axiosClient.post(`unidad`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    //return axiosClient.post(`unidad`, request);
}

const remove = (id) => {
    return axiosClient.delete(`unidad/${id}`);
}

const generateRequest = (request) => {

    let documento  = (typeof request["documento"] === "object") ? request["documento"] : null;
    let unidad = {...request, createdAt: null, updatedAt: null}
    delete unidad.documento;

    let cotasUp = unidad.cotas.map(f => {
        f = {...f, createdAt: null, updatedAt: null}
        return f;
    });

    unidad.cotas = [...cotasUp];

    console.log("generateReques unidad", unidad);
    console.log("generateReques documento", documento);

    let formData = new FormData();
    formData.append("documento", documento);
    formData.append("unidad", JSON.stringify(unidad));

    return formData;
}

const UnidadService =  {
    getAll,
    getById,
    update,
    create,
    remove
}

export default UnidadService;

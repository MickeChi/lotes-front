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
    let formData = generateRequest(request);
    console.log("generateReques t update", formData);
    return axiosClient.put(`proyecto/${request.id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

const create = (request) => {
    let formData = generateRequest(request);
    console.log("generateReques t create", formData);
    return axiosClient.post(`proyecto`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

const remove = (id) => {
    return axiosClient.get(`proyecto/${id}`);
}

const getunidadesDoc = (id) => {
    return axiosClient.get(`proyecto/generate-proyecto-doc/${id}`);
}

const generateRequest = (request) => {

    let documento  = (typeof request["documento"] === "object") ? request["documento"] : null;
    let proyecto = {...request, createdAt: null, updatedAt: null}
    delete proyecto.documento;
    /*proyecto.unidadesExternas.map(f => {
        f.createdAt = null;
        f.updatedAt = null;
        return f;
    });*/

    console.log("generateReques proyecto", proyecto);
    console.log("generateReques documento", documento);



    let formData = new FormData();
    formData.append("documento", documento);
    formData.append("proyecto", JSON.stringify(proyecto));
    /*for (var key in request) {
        let value = null

        switch (key) {
            case "unidadesExternas":
              value = JSON.stringify(request[key]);
              break;
            case "documento":
                value = (typeof request[key] === "object") ? request[key] : null;
                break;
            default:
                value = request[key];
                break;
        }

        if (value !== null) {
            console.log(key, value);
            formData.append(key, value);
        }

    }*/

    return formData;
}

const ProyectoService = {
    getAll,
    getById,
    update,
    create,
    remove,
    getunidadesDoc
}

export default ProyectoService;

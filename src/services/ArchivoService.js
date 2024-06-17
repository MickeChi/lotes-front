import axiosClient from "../utils/axiosClient.js";

const getAll = (request) =>{
    return axiosClient.get(`archivo`, {
        params: request
    });
}

const getById = (id) => {
    return axiosClient.get(`archivo/${id}`);
}

const update = (request) => {
    let formData = generateRequest(request);
    console.log("generateReques t update", formData);
    return axiosClient.put(`archivo/${request.id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

const create = (request) => {
    let formData = generateRequest(request);
    console.log("generateReques t create", formData);
    return axiosClient.post(`archivo`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
}

const remove = (id) => {
    return axiosClient.delete(`archivo/${id}`);
}

const generateRequest = (request) => {

    let documento  = (typeof request["documento"] === "object") ? request["documento"] : null;
    let archivo = {...request, createdAt: null, updatedAt: null}
    delete archivo.documento;
    /*archivo.unidadesExternas.map(f => {
        f.createdAt = null;
        f.updatedAt = null;
        return f;
    });*/

    console.log("generateReques archivo", archivo);
    console.log("generateReques documento", documento);



    let formData = new FormData();
    formData.append("documento", documento);
    formData.append("archivo", JSON.stringify(archivo));
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
}

export default ProyectoService;

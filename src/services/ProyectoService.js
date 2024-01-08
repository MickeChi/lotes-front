import axiosClient from 'src/utils/axiosClient.js';

class ProyectoService {

    getProyectos(request) {
        return axiosClient.get(`proyecto`, {
            params: request
        });
    }

    getProyecto(id) {
        return axiosClient.get(`proyecto/${id}`);
    }

    updateProyecto(request) {
        return axiosClient.put(`proyecto/${request.id}`, request);
    }

    addProyecto(request) {
        return axiosClient.post(`proyecto`, request);
    }

}

export default new ProyectoService();

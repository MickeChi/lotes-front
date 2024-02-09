import estadosMunicipiosMx from "../utils/estadosMunicipiosMx.js"
import estadosMx from "../utils/estadosMx.js"

  const getAll = () => {
    return Promise.resolve(estadosMunicipiosMx);
  }

  const getByEstadoNombre = (nombre) => {
    const estado = estadosMx.find(e => e.name === nombre);
    const municipios = estadosMunicipiosMx.find(e => e.state_id === estado.id);
    return Promise.resolve(municipios);
  }

  const getNamesByEstadoNombre = (nombre) => {
    const estado = estadosMx.find(e => e.name === nombre);
    const municipios = estado ? estadosMunicipiosMx.filter(e => e.state_id === estado.id).map(e => e.name) : [];
    return Promise.resolve(municipios);
  }

  const getByEstadoId = (estadoId) => {
    const municipios = estadosMunicipiosMx.find(e => e.state_id === estadoId);
    return Promise.resolve(municipios);
  }

const MunicipiosService = {
  getAll,
  getByEstadoNombre,
  getNamesByEstadoNombre,
  getByEstadoId
}

export default MunicipiosService;

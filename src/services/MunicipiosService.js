import estadosMunicipiosMx from "../utils/estadosMunicipiosMx.js"
import estadosMx from "../utils/estadosMx.js"

class MunicipiosService {
  
  getMunicipios() {
    return Promise.resolve(estadosMunicipiosMx);
  }
  
  getMunicipiosByEstadoNombre(nombre) {
    const estado = estadosMx.find(e => e.name === nombre);
    const municipios = estadosMunicipiosMx.find(e => e.state_id === estado.id);
    return Promise.resolve(municipios);
  }

  getNombreMunicipiosByEstadoNombre(nombre) {
    const estado = estadosMx.find(e => e.name === nombre);
    const municipios = estado ? estadosMunicipiosMx.filter(e => e.state_id === estado.id).map(e => e.name) : [];
    return Promise.resolve(municipios);
  }

  getMunicipiosByEstadoId(estadoId) {
    const municipios = estadosMunicipiosMx.find(e => e.state_id === estadoId);
    return Promise.resolve(municipios);
  }
    
}

export default new MunicipiosService();

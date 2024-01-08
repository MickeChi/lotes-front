import estadosMx from 'src/helpers/estadosMx';

//import { ID_APLICACION, API_BASE } from 'src/constants';

//const API = API_BASE + '/usuario';

class EstadoService {
  
  getEstados() {
    return Promise.resolve(estadosMx);
  }

  getNombreEstados() {
    return Promise.resolve(estadosMx.map(e => e.name));
  }
  
  getEstadoByNombre(nombre) {
    const estado = estadosMx.find(e => e.name === nombre);
    return Promise.resolve(estado);
  }

  getEstadoById(id) {
    const estado = estadosMx.find(e => e.id === id);
    return Promise.resolve(estado);
  }
    
}

export default new EstadoService();

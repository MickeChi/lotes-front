import estadosMx from "../utils/estadosMx.js"

const getAll = () => {
  return Promise.resolve(estadosMx);
}

const getAllNames = () => {
  return Promise.resolve(estadosMx.map(e => e.name));
}

const getByName = (nombre) => {
  const estado = estadosMx.find(e => e.name === nombre);
  return Promise.resolve(estado);
}

const getById = (id) => {
  const estado = estadosMx.find(e => e.id === id);
  return Promise.resolve(estado);
}

const EstadoService = {
  getAll,
  getAllNames,
  getByName,
  getById
}

export default EstadoService;

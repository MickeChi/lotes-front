export const TiposIndicadores = Object.freeze({
    POR_USUARIO: 1,
    POR_USUARIO_ENTIDAD: 2,
    POR_USUARIO_OPERACION: 3,
    POR_TODOS: 4,
    POR_ENTIDAD: 5,
    POR_OPERACION: 6
});

export const USUARIO_DEFAULT = 1;

export const Estatus = Object.freeze({
    DESACTIVADO: "DESACTIVADO",
    ACTIVO: "ACTIVO"
});


export const IdbProps = Object.freeze({
    DB_NAME: "lotesDB",
    STORE_NAME: "projectFiles",
    STORE_KEY: "idbxFile",
    DB_VERSION: 1
});


export const EstatusArchivos = Object.freeze({
    CARGA_ARCHIVOS_INIT: "CARGA_ARCHIVOS_INIT",
    CARGA_ARCHIVOS_FIN: "CARGA_ARCHIVOS_FIN"
});

export const ArchivosProps = Object.freeze({
    FILE_TYPES: ["application/pdf", "image/jpeg", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    FILE_TYPES_PREVIEW: ["application/pdf", "image/jpeg"],
    MAX_FILE_SIZE: 50,
    BATCH_SIZE: 5,
    MAX_FILES_SELECTED: 100
});

export const orientaciones = ["NORTE", "SUR", "ESTE", "OESTE", "NOROESTE", "NORESTE", "SUROESTE", "SURESTE"];

export const usos = ["HABITACIONAL", "COMERCIAL", "COMUN", "SOLAR"];

export const tiposUnidad = ["PARCELA", "VIALIDAD", "LOTE"];

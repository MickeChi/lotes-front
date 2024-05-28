const datosLineChartOperaciones = (indicadores) => {
    let datos = [];
    indicadores.forEach(i => {
        let existe = datos.find(o => o.id === i.tipoEntidad);
        if(existe === undefined){
            let obLine = {
                id: i.tipoEntidad,
                color: null,
                data: [{x: i.tipoOperacion, y: i.cantOperaciones}]
            }
            datos.push(obLine);
        }else{
            existe.data.push({x: i.tipoOperacion, y: i.cantOperaciones})
        }
    });

    return datos;
}

const datosBarChartCostos = (indicadores) => {
    let datos = [];
    indicadores.forEach(i => {
        let existe = datos.find(o => o.operacion === i.tipoOperacion);
        if(existe === undefined){
            let obLine = {
                operacion: i.tipoOperacion,
                [getTipoEntidad(i.tipoEntidad)]: i.costoTotal
            }
            datos.push(obLine);
        }else{
            existe[getTipoEntidad(i.tipoEntidad)] = i.costoTotal;
        }
    });

    return datos;
}

const getTipoEntidad = (tipoEntidad) => {
    let tipo = null;
    switch(tipoEntidad){
        case "PROYECTO":
            tipo = "PROYECTOS";
            break;
        case "unidad":
            tipo = "unidadES";
            break;
        case "COTA":
            tipo = "COTAS";
            break;
        case "DOCUMENTO_UNIDADES":
            tipo = "DOCUMENTOS";
            break;
        default:
            tipo = "";
    }

    return tipo;
}

const totalCosto = (indicadores) => indicadores.map(i => i.costoTotal)
        .reduce((ac, cv) => {return ac + cv }, 0);


const totalOperaciones = (indicadores) => indicadores.map(i => i.cantOperaciones)
    .reduce((ac, cv) => {return ac + cv }, 0);


const indicadoresCommons = {
    datosLineChartOperaciones,
    datosBarChartCostos,
    totalCosto,
    totalOperaciones
}

export default indicadoresCommons;


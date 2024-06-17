onmessage = function (e) {
    console.log('Worker: Message received from main script: ', e.data);

    const dbName = e.data.DB_NAME;
    const storeName = e.data.STORE_NAME;
    const dbVersion = e.data.DB_VERSION;
    let db = null;

    let resultadosWorker = { ...e.data };

    if (e.data.accion === "CARGA_ARCHIVOS_INIT") {
        const request = indexedDB.open(dbName, dbVersion);
        const dataFiles = [];

        request.onerror = (event) => {
            console.log(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target['result'];
            let trans = db.transaction(storeName, IDBTransaction.READ_ONLY);
            let store = trans.objectStore(storeName);

            store.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {

                    //console.log("openCursor value: ", cursor.value);
                    dataFiles.push(cursor.value);
                    cursor.continue();

                }
            };

            trans.oncomplete = (evt) => {

                console.log("oncomplete files to upload: ", dataFiles.length);

                uploadAllFilesBatch(dataFiles)
                    .then(responseData => {
                        // Send the response data back to the main thread
                        console.log("uploadFileToServer success: ", responseData);
                        resultadosWorker = { ...resultadosWorker, message: "Archivos cargados success", uploadResults: responseData};
                        deleteAllEntriesFromIndexedDb(storeName, db, resultadosWorker);

                    })
                    .catch(error => {
                        // Handle any errors that occur during the API call
                        console.error('uploadFileToServer Error:', error);
                        resultadosWorker = { ...resultadosWorker, message: "Archivos cargados con errores", uploadResults:[] }
                        deleteAllEntriesFromIndexedDb(storeName, db, resultadosWorker);

                    });

            };

        };

    }

}

const deleteAllEntriesFromIndexedDb = (storeName, db, resultados) => {
    const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
    store.clear();
    store.transaction.oncomplete = () => {
        postMessage(resultados);
    };
};

const deleteEntriesFromIndexedDb = (storeName, db, resultados) => {
    const store = db.transaction(storeName, 'readwrite').objectStore(storeName);
    resultados.uploadResults.forEach(item => {
        if(item.mensaje === "SUCCESS"){
            store.delete(item.proyectoFile.id);
        }
    });

    store.transaction.oncomplete = async () => {
        console.log("Se han eliminado los registros existosos");
        postMessage(resultados);
    };
};

//Envía todas las peticiones de carga de archivo al mismo tiempo
const uploadAllFiles = async (files) => {
    console.log("Enviando todos los archivos");
    let promisesFiles = [];

    // Abort if there were no files selected
    if (!files.length) return;

    // Store promises in array
    files.forEach(fileInfo => {
        promisesFiles.push(uploadFileToServer(fileInfo).catch(error => error));
    });

    return Promise.all(promisesFiles);
};

//Envía las peticiones en lotes configurables
const uploadAllFilesBatch = async (files) => {
    console.log("Enviando archivos por lotes");
    const batchSize = 5;

    let responseAll = [];
    // request counter
    let curReq = 0;
    // as long as there are items in the list continue to form batches
    while (curReq < files.length) {
        // a batch is either limited by the batch size or it is smaller than the batch size when there are less items required
        const end = files.length < curReq + batchSize ? files.length: curReq + batchSize;
        // we know the number of concurrent request so reserve memory for this
        const concurrentReq = []; //new Array(batchSize);
        // issue one request for each item in the batch
        for (let index = curReq; index < end; index++) {
            let fileInfo = files[index];
            concurrentReq.push(uploadFileToServer(fileInfo).catch(error => error));
            console.log(`sending request ${curReq}...concurrentReq`)
            curReq++;
        }
        // wait until all promises are done or one promise is rejected
        let responseData = await Promise.all(concurrentReq);
        responseAll.push(...responseData);
        console.log(`requests ${curReq - batchSize}-${curReq} done. responseAll: ${responseAll.length}, responseData:`, responseData);

    }

    return Promise.resolve(responseAll);

};

const uploadFileToServer = (fileInfo) => {

    let fileData = fileInfo.fileData;
    let proyectoId = fileInfo.proyectoId;
    let fileNameCode = fileInfo.fileNameCode;
    let idbxFile = fileInfo.idbxFile;

    let formData = new FormData();
    formData.append("file", fileData);
    formData.append("proyectoId", proyectoId);
    formData.append("fileNameCode", fileNameCode);

    return new Promise((resolve, reject) => {

        fetch('http://localhost:8081/api/archivo', {
            method: 'POST',
            body: formData
        })
            .then(response => {

                if (response.ok) {

                    response.json().then(resp => {
                        resp.idbxFile = idbxFile;
                        resp.mensaje = "SUCCESS";
                        resp.estatus = response.status
                        resolve(resp);
                    });

                } else {
                    response.json().then(resp => {
                        resp.idbxFile = idbxFile;
                        resp.mensaje = "ERROR";
                        resp.estatus = response.status;

                        reject(resp);
                    });
                }
            })
            .catch(error => {
                let objResp = {mensaje: "ERROR", estatus: error.status, idbxFile, error}
                reject(objResp);
            });
    });



}
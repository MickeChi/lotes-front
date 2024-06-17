import {IdbProps} from "../utils/constantes.js";

const initIndexedDb = () => {
    const idb =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
    //check for support
    if (!idb) {
        console.log("This browser doesn't support IndexedDB");
        return;
    }

    const request = idb.open(IdbProps.DB_NAME, IdbProps.DB_VERSION);

    request.onerror = (event) => {
        console.error("An error occurred with IndexedDB");
        console.error(event);
    };

    request.onupgradeneeded = (event) => {
        console.log(event);
        const db = event.target.result;

        if (!db.objectStoreNames.contains(IdbProps.STORE_NAME)) {
            const objectStore = db.createObjectStore(IdbProps.STORE_NAME, { keyPath: IdbProps.STORE_KEY, autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        console.log("Database opened successfully");
    };

};

const getIdbxInstance = () => {
    return new Promise((resolve, reject) => {
        const idb =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;
        //check for support
        if (!idb) {
            console.log("This browser doesn't support IndexedDB");
            reject("This browser doesn't support IndexedDB");
        }

        const request = idb.open(IdbProps.DB_NAME, IdbProps.DB_VERSION);

        request.onerror = (event) => {
            console.error("An error occurred with IndexedDB");
            reject(event.target.error);
        };

        request.onupgradeneeded = (event) => {
            console.log(event);
            const db = event.target.result;
            if (!db.objectStoreNames.contains(IdbProps.STORE_NAME)) {
                const objectStore = db.createObjectStore(IdbProps.STORE_NAME, { keyPath: IdbProps.STORE_KEY, autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully");
            resolve(event.target.result);
        };

    });
};

const IdbxService = {
    initIndexedDb,
    getIdbxInstance,
}

export default IdbxService;


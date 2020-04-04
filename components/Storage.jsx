import { createContext, useState, useReducer, useEffect } from 'react';

export const storageKey = 'v1';

const initialObject = {};

export const StorageContext = createContext([initialObject, () => null]);

const storageAvailable = () => {
    // From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    if (
        window !== 'undefined' &&
        typeof window.localStorage === 'object' &&
        typeof window.localStorage.getItem === 'function'
    ) {
        const storage = window.localStorage;
        try {
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
                e instanceof DOMException &&
                // everything except Firefox
                (e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
            );
        }
    }
    return false;
};

const deepSet = (obj, path, val) => {
    let curr = obj;
    path.forEach((item, index) => {
        if (index === path.length - 1) {
            curr[item] = val;
        } else if (!(item in curr)) {
            curr[item] = {};
        }
        curr = curr[item];
    });
    return obj;
};

const actions = (storage, action) => {
    switch (action.type) {
        case 'load':
            return { ...action.data, available: true };
        case 'error':
            return { ...storage, available: false };
        case 'pageData':
            deepSet(storage, ['pageData', action.dir, action.id, action.key], action.val);
            return { ...storage };
        default:
            throw new Error('Invalid action!');
    }
};

export const StorageProvider = ({ children }) => {
    const [firstLoad, setFirstLoad] = useState(true);
    const [storage, setStorage] = useReducer(actions, initialObject);

    useEffect(() => {
        if (storageAvailable()) {
            let data = {};
            const local = window.localStorage.getItem(storageKey);
            if (local !== null) {
                try {
                    data = JSON.parse(local);
                } catch (e) {
                    // pass
                }
            }
            setStorage({ type: 'load', data });
        }
    }, []);

    useEffect(() => {
        if (storage.available) {
            if (firstLoad) {
                setFirstLoad(false); // TODO Must be a better way
            } else {
                try {
                    window.localStorage.setItem(storageKey, JSON.stringify(storage));
                } catch (e) {
                    setStorage({ type: 'error' });
                }
            }
        }
    }, [storage]);

    return (
        <StorageContext.Provider value={[storage, setStorage]}>{children}</StorageContext.Provider>
    );
};

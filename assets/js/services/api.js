import config from "../config/config";

export const loadObjectByIdAndType = async (id, type) => {
    const response = await fetch(
        config.apiUrl + '/' + type + '/' + id,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
    ).catch((e) => {
        console.error(e);
    });

    return response.json();
}

export const loadObjectsFromApi = async (type) => {
    const response = await fetch(
        config.apiUrl + '/' + type,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
    ).catch((e) => {
        console.error(e);
    });

    return response.json();
}
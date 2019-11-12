import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 100000
});

async function getResultByID(id) {
    try {
        const result = await instance.get(`/scans/${id}`, {});
        return result.data.data;
    } catch (e) {
        return null;
    }
}

async function listResults() {
    try {
        const result = await instance.get('/scans');
        return result.data.data;
    } catch (e) {
        return { records: [], count: 0 };
    }
}

async function addToQueue(payload) {
    return await instance.post('/scans/add-to-queue', payload);
}

async function startScanning(id) {
    return await instance.post(`/scans/${id}/start`, {});
}

async function finishScanning(id, payload) {
    return await instance.post(`/scans/${id}/finish`, payload);
}


export {
    addToQueue,
    startScanning,
    finishScanning,
    listResults,
    getResultByID,
}
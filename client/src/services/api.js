import axios from 'axios'

const API = axios.create({
    baseURL: 'https://taskmanager-api-6yg4.onrender.com',
    // baseURL: 'http://localhost:8000',
})

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export default API

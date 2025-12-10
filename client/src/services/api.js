import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
});

export const getGames = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/games?${params}`);
    return res.data;
};

export const getGame = async (id) => {
    const res = await api.get(`/games/${id}`);
    return res.data;
};

export const createGame = async (gameData) => {
    const res = await api.post('/games', gameData);
    return res.data;
};

export const updateGame = async (id, gameData) => {
    const res = await api.put(`/games/${id}`, gameData);
    return res.data;
};

export const deleteGame = async (id) => {
    const res = await api.delete(`/games/${id}`);
    return res.data;
};

export const toggleFavorite = async (id) => {
    const res = await api.post(`/games/${id}/favorite`);
    return res.data;
};

export const getStats = async () => {
    const res = await api.get('/stats');
    return res.data;
};

export const exportGames = () => {
    window.open(`${API_URL}/games/export`, '_blank');
};

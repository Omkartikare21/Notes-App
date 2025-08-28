import axios from 'axios';

export const loginUser = async({email, password}) =>{
    try {
        const response = await axios.post('/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}
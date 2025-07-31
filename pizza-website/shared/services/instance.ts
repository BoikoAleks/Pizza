import axios from 'axios';

console.log("помилка тут",process.env.NEXT_PUBLIC_API_URL);

export const axiosInstance = axios.create({
    
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    
}
);
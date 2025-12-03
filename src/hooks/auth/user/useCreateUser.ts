import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";
import { CREATE_USER } from "./constant";

export const createUserApi= async (userData: any) => {
    try {
        const token = getToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await api.post(`${CREATE_USER}`,userData, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
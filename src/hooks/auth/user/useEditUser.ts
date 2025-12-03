import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";
import { EDIT_USER } from "./constant";

export const EditUserApi= async (userId: string, userData: any) => {
    try {
        const token = getToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                 "Content-Type":  "multipart/form-data"
        
            },
        };
        const response = await api.put(`${EDIT_USER}/${userId}`, userData, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
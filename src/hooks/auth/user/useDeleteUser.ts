import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";
import {  DELETE_USER } from "./constant";

export const DeleteUserApi= async (userId: any) => {
    try {
        const token = getToken();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await api.delete(`${DELETE_USER}/${userId}`, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
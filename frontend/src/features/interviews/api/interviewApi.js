import axios from "axios";

import { API_BASE_URL } from "../../../shared/utils/api";

export const fetchMyInterviews = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/interviews`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

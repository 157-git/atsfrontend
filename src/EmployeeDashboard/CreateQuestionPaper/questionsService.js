import axios from "axios";
import { API_BASE_URL } from "../../api/api";

export const addQuestion = async (payloadData) => {
    const res = await axios.post(
        `${API_BASE_URL}/questions`,
        payloadData
    );
    return res.data;
};

export const loadQuestionsByReqId = async (reqId) => {
    const res = await axios.get(
        `${API_BASE_URL}/getAllQuestionsByReqId/${reqId}`
    );
    return res.data;
};

export const updateQuestion = async (id, updateData) => {
    const res = await axios.put(
        `${API_BASE_URL}/updateQuestionById/${id}`,
        updateData
    );
    return res.data;
};

export const deleteQuestion = async (id) => {
    const res = await axios.delete(
        `${API_BASE_URL}/deleteQuestionById/${id}`
    );
    return res.data;
};

export const deleteSectionByReqIdAndSection = async (reqId, section) => {
    await axios.delete(
        `${API_BASE_URL}/requirement/${reqId}/section/${section}`
    );
};

export const getQuestionsByReqId = async (reqId) => {
    const res = await axios.get(
        `${API_BASE_URL}/getAllQuestionsByReqId/${reqId}`
    );
    return res.data;
};
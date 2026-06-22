import axios from "axios";
import { API_BASE_URL } from "../../api/api";

export const loadRequirements = async () => {
    const res = await axios.get(`${API_BASE_URL}/requirements`);
    return res.data;
};

export const checkExamAttempted = async (candidateId, requirementId) => {
    const res = await axios.get(`${API_BASE_URL}/check`, {
        params: { candidateId, requirementId }
    });
    return res.data;
};

export const submitExam = async (payload) => {
    const res = await axios.post(`${API_BASE_URL}/submitExam`, payload);
    return res.data;
};

export const getExamPdfUrl = (submissionId) => {
    return `${API_BASE_URL}/${submissionId}/pdf`;
};

export const getExamReports = async () => {
    const res = await axios.get(`${API_BASE_URL}/getAllReports`);
    return res.data;
};

export const startExam = async (candidateId, requirementId) => {
    await axios.post(`${API_BASE_URL}/start`, {
        candidateId,
        requirementId
    });
};
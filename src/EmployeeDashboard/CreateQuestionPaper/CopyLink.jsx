import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api/api";
// import RequirementHeader from "./RequirementsHeader";

function CopyLink({ selectedRequirement }) {

    const { employeeId, userType } = useParams();

    const [userUrlString, setUserUrlString] = useState("");

    // const [selectedRequirement, setSelectedRequirement] = useState(null);

    useEffect(() => {
        getEncodeUrlString();
    }, []);

    const getEncodeUrlString = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/save-shorten-url`,
                {
                    employeeId,
                    userType,
                }
            );

            setUserUrlString(response.data.shortenUrl);
        }
        catch (error) {
            console.error(error);
        }
    };

    const userTypeKey = () => {
        if (userType === "Recruiters") return "R-";
        if (userType === "TeamLeader") return "T-";
        if (userType === "Manager") return "M-";
        if (userType === "SuperUser") return "S-";
        return "";
    };

    const copyExamLink = async () => {

        if (!selectedRequirement) {
            alert("Please select a requirement first");
            return;
        }

        const shareUrl =
            `http://localhost:3000/applicant-form/${userTypeKey()}abc+${userUrlString}?exam=true&reqId=${selectedRequirement.requirementId}`;

        await navigator.clipboard.writeText(shareUrl);

        alert("Exam link copied!");
    };

    return (
        <button
            onClick={copyExamLink}
            disabled={!selectedRequirement}
            className="px-4 py-2 bg-[#00968f] text-white rounded disabled:opacity-50"
        >
            Copy Exam Link
        </button>
    );
}

export default CopyLink;
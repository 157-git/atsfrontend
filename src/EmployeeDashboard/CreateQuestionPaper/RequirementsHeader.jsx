import { useEffect, useState } from "react";

function RequirementHeader({ onRequirementSelect }) {

    const [requirements, setRequirements] = useState([]);
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchGlobalReq = async () => {
        try {
            const response = await fetch(
                "https://rg.157careers.in/api/ats/157industries/company-details"
            );
            const data = await response.json();
            setRequirements(data);
        }
        catch (error) {
            console.error("Error:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleRequirementChange = (e) => {
        const reqId = Number(e.target.value);
        const selected = requirements.find(
            req => req.requirementId === reqId
        ) || null;
        setSelectedRequirement(selected);
        onRequirementSelect?.(selected);
    };

    useEffect(() => {
        fetchGlobalReq();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block mb-1">Requirement ID</label>
                <select
                    className="border w-full rounded p-2"
                    onChange={handleRequirementChange}
                >
                    <option value="">Select Requirement</option>
                    {requirements.map((req) => (
                        <option key={req.requirementId} value={req.requirementId}>
                            {req.requirementId}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1">Company Name</label>
                <input
                    type="text"
                    value={selectedRequirement?.companyName || ""}
                    readOnly
                    className="w-full border rounded p-2 bg-gray-100"
                    placeholder="Company Name"
                />
            </div>

            <div>
                <label className="block mb-1">Designation</label>
                <input
                    type="text"
                    value={selectedRequirement?.designation || ""}
                    readOnly
                    className="w-full border rounded p-2 bg-gray-100"
                    placeholder="Designation"
                />
            </div>
        </div>
    );
}

export default RequirementHeader;
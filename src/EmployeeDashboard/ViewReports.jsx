import { useState, useEffect } from "react";
import { getExamReports, getExamPdfUrl } from "./CreateQuestionPaper/examSubmissionService";
import NavLinks from "./CreateQuestionPaper/NavLinks";

function ViewReports() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getExamReports();
                setReports(data);
            }
            catch (error) {
                console.log("Error : ", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-6">Exam Reports</h2>

                    {loading ? (
                        <p className="text-gray-500">Loading reports...</p>
                    ) : reports.length === 0 ? (
                        <p className="text-gray-500">No exam reports found.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="bg-[#00968f] text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Sr.No.</th>
                                        <th className="px-4 py-3 text-left">Requirement ID</th>
                                        <th className="px-4 py-3 text-left">Candidate ID</th>
                                        <th className="px-4 py-3 text-left">Report</th>
                                        <th className="px-4 py-3 text-left">Submitted On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report, index) => (
                                        <tr
                                            key={report.id}>
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">{report.requirementId}</td>
                                            <td className="px-4 py-3">{report.candidateId}</td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={getExamPdfUrl(report.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 rounded bg-[#00968f] text-white text-xs hover:opacity-90 inline-block"
                                                >
                                                    View PDF
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {formatDate(report.submittedAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ViewReports;
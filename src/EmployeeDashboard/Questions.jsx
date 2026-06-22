import { useEffect, useState } from "react";
import CompanyInfoHeader from "./CreateQuestionPaper/CompanyInfoHeader";
import { getQuestionsByReqId } from "./CreateQuestionPaper/questionsService";
import NavLinks from "./CreateQuestionPaper/NavLinks";
import RequirementHeader from "./CreateQuestionPaper/RequirementsHeader";
import CopyLink from "./CreateQuestionPaper/CopyLink";

function Questions({ reqId }) {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequirement, setSelectedRequirement] = useState(null);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestionsByReqId(
                selectedRequirement.requirementId
            ); setQuestions(data);
        }
        catch (error) {
            console.log("Error : ", error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRequirement) {
            fetchQuestions();
        }
    }, [selectedRequirement]);

    const groupedBySection = questions.reduce((acc, q) => {
        const section = q.section || "Uncategorized";
        if (!acc[section])
            acc[section] = [];
        acc[section].push(q);
        return acc;
    }, {});

    return (
        <>
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mt-4">

                <RequirementHeader
                    onRequirementSelect={setSelectedRequirement}
                />

                <div className="flex justify-end mt-4">
                    <CopyLink selectedRequirement={selectedRequirement} />
                </div>

            </div>

            <div className="bg-gray-100 p-4 md:p-6">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">
                    {Object.keys(groupedBySection).length === 0 && (
                        <p className="text-gray-500">No questions found.</p>
                    )}

                    {Object.entries(groupedBySection).map(([section, sectionQuestions]) => (
                        <div key={section} className="rounded-xl p-4">
                            <h3 className="text-lg font-semibold mb-3">
                                {section} ({sectionQuestions.length} question{sectionQuestions.length !== 1 ? "s" : ""})
                            </h3>

                            <div className="space-y-4">
                                {sectionQuestions.map((q, index) => (
                                    <div key={q.id} className="border-b pb-3">
                                        <p className="font-medium">
                                            {index + 1}. {q.question}
                                        </p>

                                        {q.questionType === "MCQ" && (
                                            <div className="mt-2 flex flex-wrap gap-6 pl-4">
                                                {[q.option1, q.option2, q.option3, q.option4]
                                                    .filter(Boolean)
                                                    .map((opt, i) => (
                                                        <label key={i} className="flex items-center gap-2 whitespace-nowrap">
                                                            <input
                                                                type="radio"
                                                                name={`question-${q.id}`}
                                                                value={opt}
                                                            />
                                                            {opt}
                                                        </label>
                                                    ))}
                                            </div>
                                        )}

                                        {q.questionType === "TEXT" && (
                                            <textarea
                                                className="mt-2 w-full border rounded p-2"
                                                placeholder="Type your answer here..."
                                                rows={3}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Questions;
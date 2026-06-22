import { useEffect, useState } from "react";
import { getQuestionsByReqId } from "./CreateQuestionPaper/questionsService";
import { checkExamAttempted, startExam, submitExam } from "./CreateQuestionPaper/examSubmissionService";
import CompanyInfoHeader from "./CreateQuestionPaper/CompanyInfoHeader";
import NavLinks from "./CreateQuestionPaper/NavLinks";
import { useParams } from "react-router-dom";

function ExamPage() {

    const { reqId, candidateId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [alreadyAttempted, setAlreadyAttempted] = useState(false);
    const [examStarted, setExamStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissionId, setSubmissionId] = useState(null);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const attempted = await checkExamAttempted(candidateId, reqId);
                setAlreadyAttempted(attempted);

                if (!attempted) {
                    const data = await getQuestionsByReqId(reqId);
                    setQuestions(data);
                }
            }
            catch (err) {
                console.error("Init error:", err);
            }
            finally {
                setLoading(false);
            }
        };
        init();
    }, [reqId, candidateId]);

    const handleStartExam = async () => {
        setStarting(true);
        try {
            await startExam(candidateId, reqId); // single user click = single API call
            setExamStarted(true);
        }
        catch (err) {
            console.error("Start exam error:", err);
            alert("Failed to start exam. Please try again.");
        }
        finally {
            setStarting(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        const unanswered = questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            if (!window.confirm(`${unanswered.length} question(s) unanswered. Submit anyway?`)) {
                return;
            }
        }

        const payload = {
            candidateId,
            requirementId: reqId,
            answers: Object.entries(answers).map(([questionId, answer]) => ({
                questionId: Number(questionId),
                answer
            }))
        };

        try {
            const res = await submitExam(payload);
            setSubmissionId(res.id);
            setSubmitted(true);
        }
        catch (err) {
            console.error("Submit error:", err);
            alert("Submission failed : ", err?.message);
        }
    };

    if (loading)
        return <p className="p-6">Loading...</p>;

    if (alreadyAttempted) {
        return (
            <>
                <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
                        <p className="text-lg font-semibold mb-2">Req ID: {reqId}</p>
                        <p className="text-lg font-semibold mb-2">Already Attempted</p>
                        <p className="text-gray-500">You cannot retake this exam.</p>
                    </div>
                </div>
            </>
        );
    }

    if (submitted) {
        return (
            <>
                <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
                        <p className="text-lg font-semibold mb-4">Exam Submitted Successfully!</p>
                    </div>
                </div>
            </>
        );
    }

    // show start screen before exam begins
    if (!examStarted) {
        return (
            <>
                <CompanyInfoHeader />
                <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
                        <p className="text-lg font-semibold mb-2">Ready to start?</p>
                        <p className="text-gray-500 mb-6">
                            This exam has {questions.length} question(s).
                            Once started, you must complete and submit it.
                        </p>
                        <button
                            onClick={handleStartExam}
                            disabled={starting}
                            className="px-6 py-2 rounded bg-[#00968f] text-white disabled:opacity-50"
                        >
                            {starting ? "Starting..." : "Start Exam"}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <CompanyInfoHeader />

            <div className="bg-gray-100 p-4 md:p-6">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4 md:p-6 space-y-6">

                    {questions.length === 0 && (
                        <p className="text-gray-500">No questions found.</p>
                    )}

                    {questions.map((q, index) => (
                        <div key={q.id} className="border-b pb-4">
                            <p className="font-medium mb-2">
                                {index + 1}. {q.question}
                            </p>

                            {q.questionType === "MCQ" && (
                                <div className="flex flex-col gap-2 pl-4">
                                    {[q.option1, q.option2, q.option3, q.option4]
                                        .filter(Boolean)
                                        .map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    value={opt}
                                                    checked={answers[q.id] === opt}
                                                    onChange={() => handleAnswerChange(q.id, opt)}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                </div>
                            )}

                            {q.questionType === "TEXT" && (
                                <textarea
                                    className="mt-1 w-full border rounded p-2"
                                    placeholder="Type your answer here..."
                                    rows={3}
                                    value={answers[q.id] || ""}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}

                    {questions.length > 0 && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 rounded bg-[#00968f] text-white"
                            >
                                Submit Exam
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ExamPage;
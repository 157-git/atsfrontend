
import { useEffect, useState } from "react";
import RequirementHeader from "./CreateQuestionPaper/RequirementsHeader";
import QuestionCard from "./CreateQuestionPaper/QuestionCard";
import QuestionModal from "./CreateQuestionPaper/QuestionModal";
import { loadQuestionsByReqId, deleteQuestion, deleteSectionByReqIdAndSection } from "./CreateQuestionPaper/questionsService";
import NavLinks from "./CreateQuestionPaper/NavLinks";
import ViewReports from "./ViewReports";
import Questions from "./Questions";
import ExamPage from "./ExamPage";
import CopyLink from "./CreateQuestionPaper/CopyLink";

export default function QuestionManagement() {

    const [questions, setQuestions] = useState([]);
    const [selectedRequirement, setSelectedRequirement] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [questionType, setQuestionType] = useState("MCQ");
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [activeSection, setActiveSection] = useState("");

    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState("");

    const [expandedSections, setExpandedSections] = useState(new Set());

    const [activeTab, setActiveTab] = useState("manage");

    useEffect(() => {
        setQuestions([]);
        setSections([]);
        setExpandedSections(new Set());

        if (selectedRequirement) {
            loadQuestions(selectedRequirement.requirementId);
        }
    }, [selectedRequirement]);

    const loadQuestions = async (reqId) => {
        const data = await loadQuestionsByReqId(reqId);
        setQuestions(data);

        const sectionNames = [...new Set(data.map(q => q.section).filter(Boolean))];
        setSections(sectionNames);
    };

    const handleDelete = async (id) => {
        await deleteQuestion(id);
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const openAddModal = (type, section) => {
        setQuestionType(type);
        setEditingQuestion(null);
        setActiveSection(section);
        setOpenModal(true);
    };

    const openEditModal = (question) => {
        setQuestionType(question.questionType);
        setEditingQuestion(question);
        setActiveSection(question.section || "");
        setOpenModal(true);
    };

    const addSection = () => {
        const name = newSectionName.trim();
        if (!name || sections.includes(name)) return;
        setSections(prev => [...prev, name]);
        setNewSectionName("");
    };

    const handleDeleteSection = async (section) => {
        const sectionQuestions = questions.filter(q => q.section === section);

        const confirmMsg = sectionQuestions.length > 0
            ? `Delete section "${section}" and its ${sectionQuestions.length} question(s)?`
            : `Delete empty section "${section}"?`;

        if (!window.confirm(confirmMsg))
            return;

        try {
            // deleting all questions of this section
            if (sectionQuestions.length > 0) {
                await deleteSectionByReqIdAndSection(
                    selectedRequirement.requirementId,
                    section
                );
            }
            setQuestions(prev => prev.filter(q => q.section !== section));
            setSections(prev => prev.filter(s => s !== section));

            setExpandedSections(prev => {
                const next = new Set(prev);
                next.delete(section);
                return next;
            });
        }
        catch (err) {
            console.error("Failed to delete section:", err);
            alert("Failed to delete some questions. Please try again.");
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            }
            else {
                next.add(section);
            }
            return next;
        });
    };

    const refreshQuestions = () => {
        if (selectedRequirement) {
            loadQuestions(selectedRequirement.requirementId);
        }
    };

    console.log("Current tab:", activeTab);

    if (activeTab === "reports") {
        return (
            <>
                <NavLinks setActiveTab={setActiveTab} />
                <ViewReports />
            </>
        );
    }

    if (activeTab === "questions") {
        return (
            <>
                <NavLinks setActiveTab={setActiveTab} />
                <Questions />
            </>
        );
    }

    if (activeTab === "copyLink") {
        return (
            <>
                <NavLinks setActiveTab={setActiveTab} />
                <CopyLink />
            </>
        );
    }


    // if (activeTab === "exam") {
    //     return (
    //         <>
    //             <NavLinks setActiveTab={setActiveTab} />
    //             <ExamPage />
    //         </>
    //     );
    // }

    return (
        <>
            <NavLinks setActiveTab={setActiveTab} />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-6">Question management</h2>

                    <RequirementHeader onRequirementSelect={setSelectedRequirement} />

                    {selectedRequirement && (
                        <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <input
                                type="text"
                                placeholder="New section name (e.g. Technical, Aptitude)"
                                className="border rounded p-2 flex-1"
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                            />
                            <button
                                onClick={addSection}
                                className="px-5 py-2 rounded bg-[#00968f] text-white"
                            >
                                Add Section
                            </button>
                        </div>
                    )}
                </div>

                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-2 mt-3">
                    <div className="space-y-3">
                        {sections.length === 0 && (
                            <p className="text-gray-500">
                                No sections yet. Add a section above to start adding questions.
                            </p>
                        )}

                        {sections.map(section => {
                            const sectionQuestions = questions.filter(q => q.section === section);
                            const isExpanded = expandedSections.has(section);

                            return (
                                <div key={section} className="border rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <button className="flex gap-2 text-left" onClick={() => toggleSection(section)}>
                                            {isExpanded ? "🔼" : "🔽"}
                                            <h3 className="text-lg font-semibold">{section}</h3>
                                            <p className="text-xs text-gray-500">
                                                ({sectionQuestions.length} question{sectionQuestions.length !== 1 ? "s" : ""})
                                            </p>
                                        </button>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                className="px-2 py-1.5 rounded bg-[#00968f] text-white text-sm"
                                                onClick={() => openAddModal("MCQ", section)}
                                            >
                                                + MCQ
                                            </button>
                                            <button
                                                className="px-4 py-1.5 rounded bg-[#00968f] text-white text-sm"
                                                onClick={() => openAddModal("TEXT", section)}
                                            >
                                                + Question
                                            </button>
                                            <button
                                                className="px-3 py-1.5 rounded bg-red-500 text-white text-sm flex items-center gap-1"
                                                onClick={() => handleDeleteSection(section)}
                                                title="Delete section"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-4 space-y-4">
                                            {sectionQuestions.length === 0 && (
                                                <p className="text-sm text-gray-400">
                                                    No questions in this section yet.
                                                </p>
                                            )}
                                            {sectionQuestions.map(question => (
                                                <QuestionCard
                                                    key={question.id}
                                                    question={question}
                                                    onEdit={() => openEditModal(question)}
                                                    onDelete={() => handleDelete(question.id)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {openModal && (
                    <QuestionModal
                        closeModal={() => setOpenModal(false)}
                        questionType={questionType}
                        requirement={selectedRequirement}
                        section={activeSection}
                        editingQuestion={editingQuestion}
                        refreshQuestions={refreshQuestions}
                    />
                )}
            </div>
        </>
    );
} 
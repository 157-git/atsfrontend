import { useState } from "react";
import { addQuestion, updateQuestion } from "./questionsService";

function TextQuestionForm({ requirement, section, editingQuestion, closeModal, refreshQuestions }) {

    const [question, setQuestion] = useState(editingQuestion?.question || "");
    const [saving, setSaving] = useState(false);

    const saveQuestion = async () => {
        
        const payload = {
            requirementId: requirement.requirementId,
            section,
            questionType: "TEXT",
            question
        };

        try {
            setSaving(true);
            if (editingQuestion) {
                await updateQuestion(editingQuestion.id, payload);
            } else {
                await addQuestion(payload);
            }
            await refreshQuestions();
            closeModal();
        } catch (error) {
            console.error("Failed to save question:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-3">
            <textarea
                placeholder="Question"
                className="w-full border p-2 rounded"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button
                onClick={saveQuestion}
                disabled={saving}
                className="bg-[#00968f] text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}

export default TextQuestionForm;
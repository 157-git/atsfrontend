import { useState } from "react";
import { addQuestion, updateQuestion } from "./questionsService";

function McqQuestionForm({ requirement, section, editingQuestion, closeModal, refreshQuestions }) {

    const [form, setForm] = useState({
        question: editingQuestion?.question || "",
        option1: editingQuestion?.option1 || "",
        option2: editingQuestion?.option2 || "",
        option3: editingQuestion?.option3 || "",
        option4: editingQuestion?.option4 || "",
        correctAnswer: editingQuestion?.correctAnswer || ""
    });
    const [saving, setSaving] = useState(false);

    const updateField = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const saveQuestion = async () => {
        const payload = {
            ...form,
            requirementId: requirement.requirementId,
            section,
            questionType: "MCQ"
        };

        try {
            setSaving(true);
            if (editingQuestion) {
                await updateQuestion(editingQuestion.id, payload);
            } 
            else {
                await addQuestion(payload);
            }
            await refreshQuestions();
            closeModal();
        } 
        catch (error) {
            console.error("Failed to save question:", error);
        } 
        finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-3">
            <textarea placeholder="Question" className="w-full border p-2 rounded" value={form.question} onChange={updateField("question")} />
            <input placeholder="Option 1" className="w-full border p-2 rounded" value={form.option1} onChange={updateField("option1")} />
            <input placeholder="Option 2" className="w-full border p-2 rounded" value={form.option2} onChange={updateField("option2")} />
            <input placeholder="Option 3" className="w-full border p-2 rounded" value={form.option3} onChange={updateField("option3")} />
            <input placeholder="Option 4" className="w-full border p-2 rounded" value={form.option4} onChange={updateField("option4")} />
            <select
                className="w-full border p-2 rounded"
                value={form.correctAnswer}
                onChange={updateField("correctAnswer")}
            >
                <option value="">Select Correct Answer</option>

                {form.option1 && (
                    <option value={form.option1}>{form.option1}</option>
                )}

                {form.option2 && (
                    <option value={form.option2}>{form.option2}</option>
                )}

                {form.option3 && (
                    <option value={form.option3}>{form.option3}</option>
                )}

                {form.option4 && (
                    <option value={form.option4}>{form.option4}</option>
                )}
            </select>
            <button onClick={saveQuestion} disabled={saving} className="bg-[#00968f] text-white px-4 py-2 rounded disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}

export default McqQuestionForm;
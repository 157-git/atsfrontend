import McqQuestionForm from "./McqQuestionForm";
import TextQuestionForm from "./TextQuestionForm";

function QuestionModal({ questionType, closeModal, requirement, section, editingQuestion, refreshQuestions }) {

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[700px] max-h-[90vh] overflow-auto">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        {editingQuestion ? "Edit Question" : "Add Question"}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {questionType === "MCQ" ? (
                    <McqQuestionForm
                        requirement={requirement}
                        section={section}
                        editingQuestion={editingQuestion}
                        closeModal={closeModal}
                        refreshQuestions={refreshQuestions}
                    />
                ) : (
                    <TextQuestionForm
                        requirement={requirement}
                        section={section}
                        editingQuestion={editingQuestion}
                        closeModal={closeModal}
                        refreshQuestions={refreshQuestions}
                    />
                )}
            </div>
        </div>
    );
}

export default QuestionModal;
function QuestionCard({ question, onEdit, onDelete }) {
    return (
        <div className="border rounded p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <h3 className="font-semibold">{question.question}</h3>
                <div className="flex gap-2 shrink-0">
                    <button onClick={onEdit} className="text-blue-600 text-sm">Edit</button>
                    <button onClick={onDelete} className="text-red-600 text-sm">Delete</button>
                </div>
            </div>

            {question.questionType === "MCQ" && 
                <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>{question.option1}</li>
                    <li>{question.option2}</li>
                    <li>{question.option3}</li>
                    <li>{question.option4}</li>
                </ul>
            }

            <div className="mt-2 flex gap-2">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{question?.questionType}</span>
                {question.questionType === 'MCQ' && 
                    <span className="text-xs bg-green-200 px-2 py-1 rounded">Correct Answer: {question?.correctAnswer}</span> 
                }
            </div>
        </div>
    );
}

export default QuestionCard;
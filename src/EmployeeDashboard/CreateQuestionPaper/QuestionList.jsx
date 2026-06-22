import QuestionCard from "./QuestionCard";

function QuestionList({questions, setQuestions}) {
    return (
        <div className="mt-6">
            {
                questions.map((question, index) => (
                    <QuestionCard
                        key={index}
                        index={index}
                        question={question}
                        questions={questions}
                        setQuestions={setQuestions}
                    />
                ))
            }
        </div>
    );
}

export default QuestionList;
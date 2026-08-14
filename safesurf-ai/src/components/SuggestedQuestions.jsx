import suggestedQuestions from "../data/suggestedQuestions";

function SuggestedQuestions({ onQuestionClick }) {
  return (
    <div className="suggested-questions">
      <h3>Suggested Questions</h3>

      {suggestedQuestions.map((question, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick(question)}
        >
          {question}
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestions;
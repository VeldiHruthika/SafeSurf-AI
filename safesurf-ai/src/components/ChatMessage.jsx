function ChatMessage({ sender, message }) {
  return (
    <div className={`message ${sender}`}>
      <p>{message}</p>
    </div>
  );
}

export default ChatMessage;
document.addEventListener("DOMContentLoaded", () => {
    const chatHistory = document.getElementById("chat-history");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Function to append messages with animation and alignment
    const appendMessage = (message, sender) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = message;

        // Add message to chat history
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the latest message
    };

    // Handle message sending
    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage(message, "user"); // Show user's message
        userInput.value = ""; // Clear input

        try {
            const response = await fetch("/get_response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            appendMessage(data.response, "bot"); // Show bot's response
        } catch (error) {
            appendMessage("Error: Unable to fetch response from server.", "bot");
        }
    };

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});

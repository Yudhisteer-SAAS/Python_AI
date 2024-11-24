document.addEventListener("DOMContentLoaded", () => {
    const chatHistory = document.getElementById("chat-history");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const addMessage = (message, sender) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message", sender);
        chatHistory.appendChild(messageDiv);

        let i = 0;
        const isBold = message.startsWith("**") && message.endsWith("**");
        const formattedMessage = isBold
            ? `<strong>${message.slice(2, -2)}</strong><br>`
            : message;

        const type = () => {
            if (i < formattedMessage.length) {
                messageDiv.innerHTML += formattedMessage[i++];
                setTimeout(type, 40); // Typing speed
            }
        };
        type();

        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    const sendMessage = () => {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, "user");
        userInput.value = "";

        fetch("/get_response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        })
            .then((response) => response.json())
            .then((data) => addMessage(data.response, "ai"))
            .catch(() => addMessage("Error: Unable to fetch response.", "ai"));
    };

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});

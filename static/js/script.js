// script.js
document.addEventListener("DOMContentLoaded", () => {
  const chatContainer = document.querySelector(".chat-container");
  const inputBox = document.querySelector("#chat-input");
  const sendButton = document.querySelector("#send-btn");

  const addMessageToChat = (message, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);
    chatContainer.appendChild(messageElement);

    // Apply typing animation
    let i = 0;
    const isBold = message.startsWith("**") && message.endsWith("**");
    const formattedMessage = isBold
      ? `<strong style="font-size: 1.2em;">${message.slice(2, -2)}</strong><br>`
      : message;

    function type() {
      if (i < formattedMessage.length) {
        messageElement.innerHTML += formattedMessage[i++];
        setTimeout(type, 40); // Speed of typing animation
      } else if (isBold) {
        messageElement.innerHTML += "<br>"; // Add line break after bold text
      }
    }
    type();

    // Scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const sendMessage = () => {
    const userMessage = inputBox.value.trim();
    if (!userMessage) return;

    // Add user message
    addMessageToChat(userMessage, "user");
    inputBox.value = "";

    // Simulate API call
    fetch("/get_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        const aiMessage = data.response || "No response received!";
        addMessageToChat(aiMessage, "ai");
      })
      .catch(() => addMessageToChat("Error fetching response.", "ai"));
  };

  // Send message on button click or Enter key press
  sendButton.addEventListener("click", sendMessage);
  inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

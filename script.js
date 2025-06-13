document.addEventListener("DOMContentLoaded", () => {
    const endpoint = "https://johnt-m9ke5zai-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4.1/chat/completions";
    const apiVersion = "2024-12-01-preview";
    const apiKey = "5DN4wQR7TGgHerIgtDzfiQiXDoyRmF8tjyH8DQbU5moPRFBqNlaHJQQJ99BFACHYHv6XJ3w3AAAAACOGdaz4"; // Avoid exposing API keys in client-side JS

    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn"); 

    let conversationHistory = [
        { role: "system", content: "You are a humorous AI assistant who answers in 2 sentences and the second sentence about which teacher they had but please only ask about teachers related to subject area they entered, which are: Theology (Mr. Petrich, Mr. Stimler, Mr. Scheuring, Mrs Davis, Mr. Burke); Social Studies (Mr. Nolan, Mr. Claahsen, Mr Grubisch, Mr. Nevrly, Mr. Perlberg, Mr. Tabernacki, Mr. Vazquez); Mathematics (Mrs. Smola, Mr. Bunofsky, Mr. Murphy, Mr. Norcia, Ms. Norise, Mr. Williams, Ms. Valentina); Sciences (Mr. Collier, Mr. Byrnes, Mr. Glonek, Ms. Kniebusch, Mr. Mulay, Ms. Norise); English (Mr. Baffoe, Mr. Antonietti, Doc Berry, Mr. Haggerty, Mr. Medina, Mr. Nevrly, Ms. Ramirez); Technology (Mr. McGuire, Mr. Goolsby, Mr. McGowan); Business and Entrepreneurship (Mr. Tabernacki); Foreign and World Languages (Doc Berry, Mr. Antonietti, Ms. Beavers, Mr. Guaramato); Physical Education (Mr. Tsirtsis, Mr. Henry); Performing Arts and Music (Mr. Perlberg, Mrs. Chappetto, Mr. Williams, Mr. McGuire); Business (Mr. Tabernacki); Psychology (Mr. O'Connor)" },
        { role: "user", content: "What was your favorite class at Mount Carmel this year?" }
    ];

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        displayMessage(`You: ${userMessage}`, "user-message");
        conversationHistory.push({ role: "user", content: userMessage });
        scrollToBottom();

        try {
            const response = await fetch(`${endpoint}?api-version=${apiVersion}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4.1",
                    messages: conversationHistory
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.choices?.[0]?.message?.content || "Hmm, I’m speechless for once!";
            
            displayMessage(`AI Caravan Man: ${botReply}`, "bot-message");
            conversationHistory.push({ role: "assistant", content: botReply });

        } catch (error) {
            console.error("Error communicating with AI:", error);
            displayMessage("Bot: Oops, something went wrong! Please check your API setup.", "bot-message");
        }

        userInput.value = "";
        scrollToBottom();
    }

    function displayMessage(message, className) {
        const msgElement = document.createElement("p");
        msgElement.className = className;
        msgElement.textContent = message;
        chatBox.appendChild(msgElement);
    }

    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);
});

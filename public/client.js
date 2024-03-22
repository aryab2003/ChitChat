const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
do {
  name = prompt("Please enter your name: ");
} while (!name);

const sendButton = document.getElementById("send-btn");
const messageTextarea = document.getElementById("textarea");

sendButton.addEventListener("click", () => {
  sendMessage(messageTextarea.value);
});

messageTextarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(messageTextarea.value);
  }
});
function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
    time: new Date().toLocaleTimeString(),
  };

  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <span class="time">${msg.time}</span>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

socket.on("connectionCount", (count) => {
  document.getElementById("connection-count").innerText = count;
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

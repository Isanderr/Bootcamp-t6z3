(function() {
    class Chat {
        constructor() {
            this.init();
        }
        sendData(msgObject) {
            var data = JSON.stringify(msgObject);
            this.socket.send(data);
        }
        renderRow(dataObject) {
            var chatRow = document.createElement("div"),
                date = new Date(),
                time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                message;

            chatRow.classList.add("chatRow");

            if (dataObject.type == "status")
                message = "<span class='status'>" + dataObject.message + "</span>";
            else
                message = "<span class='name'>" + dataObject.name + "</span>: <span class='message'>" + dataObject.message + "</span>";

            chatRow.innerHTML = "<span class='time'>" + time + "</span>\n" + message;

            this.chatWindow.style.display = "";
            this.chatWindow.appendChild(chatRow);
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
        }
        displayMessage(e) {
            var dataObject = JSON.parse(e.data);
            this.renderRow(dataObject);
        }
        sendMessage() {
            var message = this.messageInput.value;
            if (message) {
                this.sendData({
                    type: "message",
                    message: message
                });
                this.messageInput.value = "";
            }
        }
        joinToChat(e) {
            var name = this.nameInput.value;
            if (name) {

                this.sendData({
                    type: "join",
                    name: name
                });


                e.target.onclick = null;
                e.target.setAttribute("disabled", "disabled");
                this.nameInput.setAttribute("readonly", "readonly");

                this.submitButton.removeAttribute("disabled");
                this.submitButton.onclick = this.sendMessage.bind(this);
            }
        }
        stopApp() {
            this.joinButton.onclick = null;
            this.joinButton.setAttribute("disabled", "disabled");
            this.submitButton.onclick = null;
            this.submitButton.setAttribute("disabled", "disabled");

            this.renderRow({
                type: "status",
                message: "Connection closed"
            })
        }
        connectToServer() {
            this.socket = new WebSocket("ws://localhost:8000");
            this.socket.onmessage = this.displayMessage.bind(this);
            this.socket.onclose = this.stopApp.bind(this);
        }
        init() {
            if (!window.WebSocket) {
                alert("Unsupported browser!");
                return;
            }
            this.nameInput = document.querySelector("#yourName");
            this.joinButton = document.querySelector("#join");
            this.chatWindow = document.querySelector("#chatWindow");
            this.messageInput = document.querySelector("#message");
            this.submitButton = document.querySelector("#submit");
            this.joinButton.onclick = this.joinToChat.bind(this);
            this.chatWindow.style.display = "none";

            this.connectToServer();

        }
    }
    var chat1 = new Chat();
})();

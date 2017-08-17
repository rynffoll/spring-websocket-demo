var stompClient = null;

function connect() {
    var socket = new SockJS('/ws-chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages', function (message) {
            addHistoryEntry(JSON.parse(message.body));
        });
    });
}

function send() {
    var input = document.getElementById("input");
    if (input !== undefined) {
        var value = input.value;
        if (value !== undefined && value !== "" ) {
            stompClient.send("/app/chat", {}, JSON.stringify({text: value !== undefined ? value : ""}));
            input.value = "";
        }
    }
}

function addHistoryEntry(message) {
    var historyEntry = document.createElement("div");
    historyEntry.classList.add("message");
    historyEntry.innerText = message.text;
    document.getElementById("history").appendChild(historyEntry);
}

document.addEventListener("DOMContentLoaded", function(){
  connect();
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    send();
  })
});
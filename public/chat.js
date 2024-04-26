window.onload = function() {
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var username;

    // Function to authenticate user
    function authenticateUser() {
        var inputUsername = prompt("Please enter your username:");
        if (!inputUsername) {
            alert("Username is required!");
            authenticateUser(); // Retry authentication if username is empty or canceled
        } else {
            username = inputUsername;
            socket.emit('authentication', { username: username });
        }
    }

    // Prompt user for authentication on page load
    authenticateUser();

    // Message listener
    socket.on('message', function (data) {
        if (data.message) {
            var html = '<b>' + (data.username ? data.username : 'Server') + ': </b>' + data.message + '<br />';
            content.innerHTML += html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });

    // Button to send message to socket
    sendButton.onclick = function() {
        var text = field.value.trim();
        if (text === "") {
            alert("Please type a message!");
        } else {
            socket.emit('send', { message: text, username: username });
            field.value = '';
        }
    };

    // Set enter key listener
    field.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            sendButton.onclick();
        }
    });
}

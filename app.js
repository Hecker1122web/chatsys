(() => {
    // 👤 Unique user name for this browser
    const userName = 'You_' + Math.floor(Math.random() * 10000);
    let currentUser = null;

    // 🔥 Firebase Realtime DB init (config goes here)
    const firebaseConfig = {
        apiKey: "AIzaSyAlJQrKNdP1U2ou8lczrnJYz-4w7B1h-Yw",
        authDomain: "chatsys-b96e7.firebaseapp.com",
        projectId: "chatsys-b96e7",
        storageBucket: "chatsys-b96e7.firebasestorage.app",
        messagingSenderId: "730596079521",
        appId: "1:730596079521:web:374115dfa380da50defde0"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();

    let currentUser = null;
    let userName = null;

    // 🔄 Switch chats between people
    window.selectUser = function (user) {
        currentUser = user;
        document.getElementById('chatHeader').innerText = `Chatting with ${user}`;
        loadMessages();
    };

    // 💬 Send message to Firebase
    window.sendMessage = function () {
        const input = document.getElementById('messageInput');
        const text = input.value.trim();
        if (!text || !currentUser) return;

        const msg = {
            text,
            sender: userName,
            timestamp: Date.now()
        };

        db.ref(`chats/${getRoomId(userName, currentUser)}`).push(msg);
        input.value = '';
    };

    // 🔁 Load messages from Firebase
    function loadMessages() {
        const room = getRoomId(userName, currentUser);
        const chatWindow = document.getElementById('chatWindow');

        db.ref(`chats/${room}`).off(); // Remove old listener

        db.ref(`chats/${room}`).on('value', (snapshot) => {
            chatWindow.innerHTML = '';
            snapshot.forEach((child) => {
                const msg = child.val();
                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble';
                if (msg.sender === userName) bubble.classList.add('you');
                bubble.innerText = msg.text;
                chatWindow.appendChild(bubble);
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
        });
    }

    // 🧠 Get unique room ID for 1-to-1 chat
    function getRoomId(user1, user2) {
        return [user1, user2].sort().join('_');
    }
})();

// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, orderBy, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNLO0wWtyXrNwyNNfxVqMA8aaG7M9YRrU",
  authDomain: "ctd-portfolio.firebaseapp.com",
  projectId: "ctd-portfolio",
  storageBucket: "ctd-portfolio.firebasestorage.app",
  messagingSenderId: "635011897990",
  appId: "1:635011897990:web:69c71fe7456cc69fe10f07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms["leave_message"];
  const messagesList = document.querySelector("#messages ul");
  const messageIds = new Set(); // keep track of message IDs already rendered

  // Render a message if not already in the DOM
  function renderMessage(id, name, message) {
    if (messageIds.has(id)) return; // skip if already rendered

    const li = document.createElement("li");
    li.id = id;
    li.innerHTML = `<strong>${name}</strong>: ${message} <button type="button">Remove</button>`;

    // Remove button deletes from Firestore and page
    li.querySelector("button").addEventListener("click", async () => {
      try {
        await deleteDoc(doc(db, "messages", id));
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });

    messagesList.prepend(li);
    messageIds.add(id);
  }

  // Real-time listener for messages
  const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"));
  onSnapshot(messagesQuery, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      const id = change.doc.id;

      if (change.type === "added") {
        renderMessage(id, data.name, data.message);
      } else if (change.type === "removed") {
        const li = document.getElementById(id);
        if (li) {
          li.remove();
          messageIds.delete(id);
        }
      }
    });
  });

  // Submit new message
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.usersName.value.trim();
    const message = form.usersMessage.value.trim();
    if (!name || !message) return;

    form.reset();

    try {
      await addDoc(collection(db, "messages"), {
        name,
        message,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("Error adding message:", err);
    }
  });
});

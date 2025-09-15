// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, query, orderBy, deleteDoc, doc, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==================== firebase Config ====================
const firebaseConfig = {
  apiKey: "AIzaSyBNLO0wWtyXrNwyNNfxVqMA8aaG7M9YRrU",
  authDomain: "ctd-portfolio.firebaseapp.com",
  projectId: "ctd-portfolio",
  storageBucket: "ctd-portfolio.firebasestorage.app",
  messagingSenderId: "635011897990",
  appId: "1:635011897990:web:69c71fe7456cc69fe10f07"
};

// ==================== initialize Firebase ====================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms["leave_message"];
  const messagesList = document.querySelector("#messages ul");
  const messageIds = new Set();

  // ==================== render a single message ====================
  function renderMessage(id, name, email, message) {
  if (messageIds.has(id)) return;

  const messagesList = document.querySelector("#messages ul");

  const li = document.createElement("li"); 
  li.id = id;

  const nameLink = document.createElement("a");
  nameLink.href = `mailto:${email}`;
  nameLink.textContent = name;
  nameLink.classList.add("message-link"); 

  const msgSpan = document.createElement("span");
  msgSpan.textContent = `: ${message}`;

  li.appendChild(nameLink);
  li.appendChild(msgSpan);

  // only show remove button if it's this user's own comment
  const currentUser = localStorage.getItem("currentUserEmail");
  if (currentUser && currentUser === email) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm("Are you sure you want to delete this message?");
      if (!confirmDelete) return;

      try {
        await deleteDoc(doc(db, "messages", id));
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });
    li.appendChild(removeBtn);
  }

  messagesList.prepend(li);
  messageIds.add(id);
}

  // ==================== real-time listener ====================
  const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"));
  onSnapshot(messagesQuery, (snapshot) => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      const id = change.doc.id;

      if (change.type === "added") {
        renderMessage(id, data.name, data.email, data.message);
      } else if (change.type === "removed") {
        const li = document.getElementById(id);
        if (li) {
          li.remove();
          messageIds.delete(id);
        }
      }
    });
  });

  // ==================== submit new message ====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.usersName.value.trim();
    const email = form.usersEmail.value.trim();
    const message = form.usersMessage.value.trim();

    if (!name || !email || !message) return;

    localStorage.setItem("currentUserEmail", email);

    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        timestamp: new Date()
      });
      console.log("Message added:", { name, email, message });
    } catch (err) {
      console.error("Error adding message:", err);
    }

    form.reset();
  });

});

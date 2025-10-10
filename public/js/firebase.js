import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNLO0wWtyXrNwyNNfxVqMA8aaG7M9YRrU",
  authDomain: "ctd-portfolio.firebaseapp.com",
  databaseURL: "https://ctd-portfolio-default-rtdb.firebaseio.com",
  projectId: "ctd-portfolio",
  storageBucket: "ctd-portfolio.firebasestorage.app",
  messagingSenderId: "635011897990",
  appId: "1:635011897990:web:69c71fe7456cc69fe10f07"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form submission
const form = document.getElementById("leave_message_form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!name || !email || !message) return alert("Enter all fields");

  await addDoc(collection(db, "messages"), {
    name,
    email,
    message,
    timestamp: new Date()
  });

  form.reset();
});

// Display messages live
const messagesList = document.querySelector("#messages ul");
const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));

onSnapshot(messagesQuery, (snapshot) => {
  messagesList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const li = document.createElement("li");

    // Add buttons in a way that looks like HTML
    li.innerHTML = `
      <strong>${data.name}:</strong> ${data.message}
      <button class="edit-btn">Edit</button>
      <button class="remove-btn">Remove</button>
    `;

    // Attach handlers using JS and doc ID
    li.querySelector(".edit-btn").addEventListener("click", async () => {
      const oldMessage = data.message;
      const newMessage = prompt("Edit your message:", oldMessage);
      if (!newMessage || newMessage === oldMessage) return;
      await updateDoc(doc(db, "messages", docSnap.id), { message: newMessage });
    });

    li.querySelector(".remove-btn").addEventListener("click", async () => {
      if (confirm("Remove this message?")) {
        await deleteDoc(doc(db, "messages", docSnap.id));
      }
    });

    messagesList.appendChild(li);
  });
});

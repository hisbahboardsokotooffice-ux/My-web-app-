import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo-o-z91lAFh-p1mP_dVmAMhJtz-BLMRk",
  authDomain: "hisbahapp.firebaseapp.com",
  databaseURL: "https://hisbahapp-default-rtdb.firebaseio.com",
  projectId: "hisbahapp",
  storageBucket: "hisbahapp.firebasestorage.app",
  messagingSenderId: "644147380199",
  appId: "1:644147380199:web:c9a62ec09db002f1560742",
  measurementId: "G-6YFCP9WVTF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// 🔒 Authentication check
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "intelligent.html";
});

// 🚪 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "intelligent.html");
});

// 📝 Report submission
document.getElementById("submitReport").addEventListener("click", () => {
  const reportText = document.getElementById("reportText").value;
  const user = auth.currentUser;
  if (reportText && user) {
    push(ref(db, "intelligentReports/" + user.uid), {
      report: reportText,
      time: new Date().toLocaleString()
    });
    document.getElementById("reportText").value = "";
  }
});

// 📬 Messaging system
document.getElementById("sendMessage").addEventListener("click", () => {
  const receiver = document.getElementById("receiverEmail").value;
  const message = document.getElementById("messageText").value;
  const user = auth.currentUser;
  if (receiver && message && user) {
    push(ref(db, "intelligentMessages/"), {
      from: user.email,
      to: receiver,
      message: message,
      date: new Date().toLocaleString()
    });
    document.getElementById("messageText").value = "";
  }
});

// 📷 Camera access
const video = document.getElementById("cameraFeed");
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

const canvas = document.getElementById("snapshot");
const uploadBtn = document.getElementById("uploadEvidence");
const captureBtn = document.getElementById("captureBtn");

captureBtn.addEventListener("click", () => {
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  canvas.style.display = "block";
});

uploadBtn.addEventListener("click", () => {
  canvas.toBlob(blob => {
    const user = auth.currentUser;
    if (user) {
      const fileRef = sRef(storage, "evidence/" + user.uid + "/" + Date.now() + ".jpg");
      uploadBytes(fileRef, blob).then(() => {
        document.getElementById("uploadStatus").innerText = "✅ Evidence uploaded successfully!";
      });
    }
  }, 'image/jpeg');
});

// 📍 GPS Tracker
if (navigator.geolocation) {
  navigator.geolocation.watchPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    document.getElementById("locationStatus").innerText = `Latitude: ${lat}, Longitude: ${lon}`;
    document.getElementById("mapFrame").src = `https://www.google.com/maps?q=${lat},${lon}&output=embed`;
  });
}
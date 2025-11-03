import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Initialize Map
const map = L.map('map').setView([13.0657, 5.2476], 8); // Sokoto
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const staffMarkers = {};
const tableBody = document.querySelector('#staffTable tbody');

// Listen for realtime location updates
onValue(ref(db, 'locations/'), snapshot => {
  tableBody.innerHTML = ''; // Clear table
  const data = snapshot.val();
  if (!data) return;

  Object.keys(data).forEach(staffId => {
    const { name, lat, lng } = data[staffId];

    // Update Table
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td>${lat.toFixed(4)}</td>
      <td>${lng.toFixed(4)}</td>
      <td><button onclick="focusStaff('${staffId}')">Track</button></td>
    `;
    tableBody.appendChild(row);

    // Update Map Marker
    if (staffMarkers[staffId]) {
      staffMarkers[staffId].setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`<b>${name}</b><br>${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      staffMarkers[staffId] = marker;
    }
  });
});

// Focus on specific staff
window.focusStaff = (id) => {
  const data = staffMarkers[id];
  if (data) {
    map.setView(data.getLatLng(), 13);
    data.openPopup();
  }
};
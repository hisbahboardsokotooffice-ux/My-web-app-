// js/command-dashboard.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { ref as dbRef, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const $ = id => document.getElementById(id);
onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = 'command.html';
  onValue(dbRef(db, `users/${user.uid}`), snap => {
    if (!snap.exists() || snap.val().role !== 'command') { alert('Access denied'); auth.signOut().then(()=>window.location.href='command.html'); return; }
    loadAllReports();
  });
});

function loadAllReports() {
  const ul = $('allReports');
  ul.innerHTML = '';
  // scan all users, then their reports
  onValue(dbRef(db, 'users'), usersSnap => {
    usersSnap.forEach(userChild => {
      const u = userChild.val();
      const uid = userChild.key;
      onValue(dbRef(db, `reports/${uid}`), reportsSnap => {
        reportsSnap.forEach(r => {
          const d = r.val();
          const li = document.createElement('li');
          li.textContent = `${u.name || u.email} (${u.office || '—'}) — ${d.date}: ${d.report}`;
          ul.appendChild(li);
        });
      });
    });
  });
}

$('logoutBtn').addEventListener('click', ()=> signOut(auth).then(()=> window.location.href='command.html'));
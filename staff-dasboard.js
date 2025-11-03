// js/staff-dashboard.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { ref as dbRef, onValue, push as dbPush, set as dbSet } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const $ = id => document.getElementById(id);

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = 'staff.html';
  $('staffEmail').textContent = user.email;
  onValue(dbRef(db, `users/${user.uid}`), snap => {
    const info = snap.val();
    if (!info || info.role !== 'staff') { alert('Not staff'); auth.signOut().then(()=>window.location.href='staff.html'); return; }
    $('staffName').textContent = info.name || 'Staff';
    $('staffOffice').textContent = info.office || '-';
    if (info.signature) $('staffProfile').src = info.signature;
    loadMyReports(user.uid);
  });
});

$('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const txt = $('reportText').value.trim();
  if (!txt) return alert('Enter a report');
  const user = auth.currentUser;
  const rRef = dbPush(dbRef(db, `reports/${user.uid}`));
  await dbSet(rRef, { report: txt, date: new Date().toLocaleString() });
  $('reportText').value = '';
  alert('Report submitted');
});

function loadMyReports(uid) {
  const ul = $('myReports');
  onValue(dbRef(db, `reports/${uid}`), snap => {
    ul.innerHTML = '';
    snap.forEach(child => {
      const r = child.val();
      const li = document.createElement('li');
      li.textContent = `${r.date}: ${r.report}`;
      ul.appendChild(li);
    });
  });
}

$('logoutBtn').addEventListener('click', ()=> signOut(auth).then(()=> window.location.href='staff.html'));
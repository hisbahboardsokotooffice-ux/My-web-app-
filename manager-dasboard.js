// js/manager-dashboard.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { ref as dbRef, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const $ = id => document.getElementById(id);

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = 'manager.html';
  onValue(dbRef(db, `users/${user.uid}`), snap => {
    const u = snap.val();
    if (!u || u.role !== 'manager') {
      alert('Access denied'); auth.signOut().then(()=> window.location.href='manager.html'); return;
    }
    loadOfficeStaff(u.office);
    loadUnitReports(u.office);
  });
});

function loadOfficeStaff(office) {
  const tbody = document.querySelector('#officeStaffTable tbody');
  onValue(dbRef(db, 'users'), snap => {
    tbody.innerHTML = '';
    snap.forEach(child => {
      const u = child.val();
      if (u.office === office && u.role === 'staff') {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>`;
        tbody.appendChild(tr);
      }
    });
  });
}

function loadUnitReports(office) {
  const ul = document.getElementById('unitReports');
  ul.innerHTML = '';
  // reports stored under reports/{uid}/... -- scan users to find staff in this office and show their reports
  onValue(dbRef(db, 'users'), usersSnap => {
    usersSnap.forEach(userChild => {
      const u = userChild.val();
      if (u.office === office && u.role === 'staff') {
        const uid = userChild.key;
        onValue(dbRef(db, `reports/${uid}`), reportsSnap => {
          reportsSnap.forEach(rep => {
            const r = rep.val();
            const li = document.createElement('li');
            li.textContent = `${u.name || u.email} — ${r.date}: ${r.report}`;
            ul.appendChild(li);
          });
        });
      }
    });
  });
}

$('logoutBtn').addEventListener('click', ()=> signOut(auth).then(()=> window.location.href='manager.html'));
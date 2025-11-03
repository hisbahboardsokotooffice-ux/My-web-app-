// js/register.js
import { auth, db, storage } from './firebase-config.js';
import { createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { ref as dbRef, set as dbSet } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

const $ = id => document.getElementById(id);

const form = $('registerForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    $('regMessage').textContent = '';
    const name = $('fullName').value.trim();
    const email = $('regEmail').value.trim();
    const password = $('regPassword').value;
    const role = $('role').value;
    const office = $('office').value.trim();
    const file = $('signatureFile').files[0];

    if (!role) { $('regMessage').textContent = 'Please choose a role.'; return; }
    if (password.length < 6) { $('regMessage').textContent = 'Password must be 6+ chars.'; return; }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      let fileURL = '';
      if (file) {
        const sRef = storageRef(storage, `signatures/${uid}.jpg`);
        await uploadBytes(sRef, file);
        fileURL = await getDownloadURL(sRef);
      }
      await dbSet(dbRef(db, `users/${uid}`), {
        name, email, role, office: office || '', signature: fileURL || '', createdAt: new Date().toISOString()
      });

      // For security, sign out newly created account (admin login will be separate)
      await signOut(auth);

      $('regMessage').textContent = 'Registration successful — please login.';
      $('regMessage').style.color = 'green';
      form.reset();
    } catch (err) {
      console.error(err);
      $('regMessage').textContent = 'Error: ' + (err.message || err);
      $('regMessage').style.color = 'red';
    }
  });
}
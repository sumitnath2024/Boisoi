document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  // Check if user is already logged in and auto-login if Remember Me was used
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      await redirectToDashboard(user);
    }
  });

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    try {
      if (rememberMe) {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } else {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }

      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await redirectToDashboard(user);
    } catch (error) {
      alert(`লগইন ব্যর্থ হয়েছে: ${error.message}`);
    }
  });

  // Redirect to respective dashboard based on user role
  async function redirectToDashboard(user) {
    try {
      const doc = await firebase.firestore().collection('users').doc(`U${user.uid}`).get();
      if (doc.exists) {
        const userData = doc.data();
        if (userData.role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else if (userData.role === 'author') {
          window.location.href = 'user-author-dashboard.html';
        } else {
          window.location.href = 'user-dashboard.html';
        }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  }
});

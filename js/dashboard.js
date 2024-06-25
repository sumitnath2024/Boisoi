document.addEventListener('DOMContentLoaded', function () {
  const welcomeMessage = document.getElementById('welcomeMessage');
  const logoutButton = document.getElementById('logout');
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const doc = await db.collection('users').doc(`U${user.uid}`).get();
        if (doc.exists) {
          const userData = doc.data();
          welcomeMessage.textContent = `স্বাগতম, ${userData.name}`;
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.log('Error getting document:', error);
      }
    } else {
      window.location.href = 'login.html';
    }
  });

  logoutButton.addEventListener('click', async function () {
    try {
      await auth.signOut();
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  });
});

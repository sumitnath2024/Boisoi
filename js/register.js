document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');
  const passwordStrength = document.getElementById('password-strength');
  const db = firebase.firestore();

  passwordInput.addEventListener('input', function () {
    const strength = calculatePasswordStrength(passwordInput.value);
    passwordStrength.textContent = `পাসওয়ার্ড শক্তি: ${strength}`;
  });

  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = passwordInput.value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('পাসওয়ার্ড মেলেনি');
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Generate unique user ID
      const userId = `U${user.uid}`;

      // Save user data to Firestore with the same document ID as user ID
      await db.collection('users').doc(userId).set({
        name: name,
        email: email,
        role: 'user',
        userId: userId
      });

      alert('নিবন্ধন সফল হয়েছে');
      window.location.href = 'login.html';
    } catch (error) {
      alert(`নিবন্ধন ব্যর্থ হয়েছে: ${error.message}`);
    }
  });

  function calculatePasswordStrength(password) {
    let strength = 'দুর্বল';
    if (password.length >= 8) {
      strength = 'মাঝারি';
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      strength = 'শক্তিশালী';
    }
    return strength;
  }
});

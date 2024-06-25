document.addEventListener('DOMContentLoaded', function () {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const paymentForm = document.getElementById('paymentForm');

  auth.onAuthStateChanged(user => {
    if (user) {
      paymentForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const paymentMethod = document.getElementById('paymentMethod').value;

        try {
          await db.collection('subscriptions').add({
            userId: user.uid,
            amount: 1000,
            paymentMethod,
            date: new Date(),
            status: 'completed'
          });

          await db.collection('users').doc(user.uid).update({
            role: 'author'
          });

          alert('আপনার সাবস্ক্রিপশন সফলভাবে সম্পন্ন হয়েছে!');
          window.location.href = 'user-author-dashboard.html';
        } catch (error) {
          console.error('Error processing payment: ', error);
          alert('পেমেন্ট প্রক্রিয়াকরণে ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
      });
    } else {
      window.location.href = 'login.html';
    }
  });
});

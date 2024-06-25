document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const profileForm = document.getElementById('profileForm');
  const subscribeButton = document.getElementById('subscribeButton');

  auth.onAuthStateChanged(user => {
    if (user) {
      const userId = user.uid;
      const userDocRef = db.collection('users').doc(userId);

      userDocRef.get().then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          document.getElementById('name').value = userData.name || '';
          document.getElementById('address').value = userData.address || '';
          document.getElementById('dob').value = userData.dob || '';
          document.getElementById('contactNo').value = userData.contactNo || '';
        }
      });

      profileForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const dob = document.getElementById('dob').value;
        const contactNo = document.getElementById('contactNo').value;

        try {
          await userDocRef.set({
            name,
            address,
            dob,
            contactNo
          }, { merge: true });

          alert('প্রোফাইল সফলভাবে সংরক্ষণ করা হয়েছে!');
        } catch (error) {
          console.error('Error updating profile: ', error);
          alert('প্রোফাইল সংরক্ষণ করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
      });

      subscribeButton.addEventListener('click', async function () {
        try {
          await userDocRef.update({
            role: 'author'
          });

          alert('আপনি সফলভাবে লেখক হিসাবে আপগ্রেড হয়েছেন!');
        } catch (error) {
          console.error('Error upgrading to author: ', error);
          alert('আপগ্রেড করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
      });
    } else {
      window.location.href = 'login.html';
    }
  });
});

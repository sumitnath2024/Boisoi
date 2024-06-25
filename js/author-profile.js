document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const auth = firebase.auth();
  const authorProfileForm = document.getElementById('authorProfileForm');
  const profilePictureDisplay = document.getElementById('profilePictureDisplay');

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
          document.getElementById('qualification').value = userData.qualification || '';
          document.getElementById('upiId').value = userData.upiId || '';
          document.getElementById('about').value = userData.about || '';

          if (userData.profilePictureUrl) {
            profilePictureDisplay.innerHTML = `<img src="${userData.profilePictureUrl}" alt="Profile Picture">`;
          }
        }
      });

      authorProfileForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const dob = document.getElementById('dob').value;
        const contactNo = document.getElementById('contactNo').value;
        const qualification = document.getElementById('qualification').value;
        const upiId = document.getElementById('upiId').value;
        const about = document.getElementById('about').value;
        const profilePicture = document.getElementById('profilePicture').files[0];

        try {
          let profilePictureUrl = '';
          if (profilePicture) {
            const profilePictureRef = storage.ref(`profilePictures/${userId}/${profilePicture.name}`);
            await profilePictureRef.put(profilePicture);
            profilePictureUrl = await profilePictureRef.getDownloadURL();
          }

          await userDocRef.set({
            name,
            address,
            dob,
            contactNo,
            qualification,
            upiId,
            about,
            profilePictureUrl
          }, { merge: true });

          if (profilePictureUrl) {
            profilePictureDisplay.innerHTML = `<img src="${profilePictureUrl}" alt="Profile Picture">`;
          }

          alert('প্রোফাইল সফলভাবে সংরক্ষণ করা হয়েছে!');
        } catch (error) {
          console.error('Error updating profile: ', error);
          alert('প্রোফাইল সংরক্ষণ করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
      });
    } else {
      window.location.href = 'login.html';
    }
  });
});

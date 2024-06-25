document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const urlParams = new URLSearchParams(window.location.search);
  const chapterId = urlParams.get('chapterId');
  const chapterContent = document.getElementById('chapterContent');
  const prevChapter = document.getElementById('prevChapter');
  const nextChapter = document.getElementById('nextChapter');

  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('chapters').doc(chapterId).get().then(doc => {
        if (doc.exists) {
          const chapterData = doc.data();
          chapterContent.innerHTML = chapterData.content;
        } else {
          chapterContent.innerHTML = 'এই চ্যাপ্টারটি খুঁজে পাওয়া যায়নি।';
        }
      }).catch(error => {
        console.error('Error fetching chapter content:', error);
        chapterContent.innerHTML = 'এই চ্যাপ্টারটি লোড করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      });
    } else {
      window.location.href = 'login.html';
    }
  });

  prevChapter.addEventListener('click', function () {
    // Logic to navigate to the previous chapter
  });

  nextChapter.addEventListener('click', function () {
    // Logic to navigate to the next chapter
  });
});

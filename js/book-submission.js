document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const bookSubmissionForm = document.getElementById('bookSubmissionForm');

  bookSubmissionForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const bookTitle = document.getElementById('bookTitle').value;
    const bookCategory = document.getElementById('bookCategory').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const bookCover = document.getElementById('bookCover').files[0];
    const chapterFiles = document.getElementById('chapterFiles').files;
    const messageToAdmin = document.getElementById('messageToAdmin').value;

    try {
      const bookCoverRef = storage.ref(`bookCovers/${bookCover.name}`);
      await bookCoverRef.put(bookCover);
      const bookCoverUrl = await bookCoverRef.getDownloadURL();

      const chapterFileUrls = [];
      for (const file of chapterFiles) {
        const chapterFileRef = storage.ref(`chapterFiles/${file.name}`);
        await chapterFileRef.put(file);
        const chapterFileUrl = await chapterFileRef.getDownloadURL();
        chapterFileUrls.push(chapterFileUrl);
      }

      const bookData = {
        title: bookTitle,
        category: bookCategory,
        description: description,
        price: price,
        coverUrl: bookCoverUrl,
        chapterUrls: chapterFileUrls,
        messageToAdmin: messageToAdmin,
        status: 'pending' // initial status
      };

      await db.collection('books').add(bookData);

      alert('বই সফলভাবে জমা দেওয়া হয়েছে!');
      bookSubmissionForm.reset();
    } catch (error) {
      console.error('Error submitting book: ', error);
      alert('বই জমা দেওয়ার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  });
});

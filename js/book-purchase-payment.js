document.addEventListener('DOMContentLoaded', function () {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const purchasePaymentForm = document.getElementById('purchasePaymentForm');
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('bookId');

  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('books').doc(bookId).get().then(doc => {
        if (doc.exists) {
          const bookData = doc.data();
          document.getElementById('bookName').value = bookData.title;
          document.getElementById('authorName').value = bookData.author;
          document.getElementById('price').value = bookData.price;
        }
      });

      purchasePaymentForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const paymentMethod = document.getElementById('paymentMethod').value;

        try {
          await db.collection('purchases').add({
            userId: user.uid,
            bookId,
            paymentMethod,
            date: new Date(),
            status: 'completed'
          });

          alert('আপনার বই ক্রয় সফলভাবে সম্পন্ন হয়েছে!');
          window.location.href = 'read-book.html?bookId=' + bookId;
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

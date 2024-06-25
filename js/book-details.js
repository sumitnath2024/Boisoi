document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  const bookNameElement = document.getElementById('bookName');
  const authorElement = document.getElementById('author');
  const categoryElement = document.getElementById('category');
  const descriptionElement = document.getElementById('description');
  const priceElement = document.getElementById('price');
  const chaptersElement = document.getElementById('chapters');
  const readFreeChapterButton = document.getElementById('readFreeChapter');
  const purchaseBookButton = document.getElementById('purchaseBook');

  function displayBookDetails(book) {
    bookNameElement.textContent = book.title;
    authorElement.textContent = book.author;
    categoryElement.textContent = book.category;
    descriptionElement.textContent = book.description;
    priceElement.textContent = book.price;

    chaptersElement.innerHTML = '';
    book.chapters.forEach((chapter, index) => {
      const chapterItem = document.createElement('li');
      chapterItem.classList.add(chapter.free ? 'free' : 'paid');
      chapterItem.textContent = `অধ্যায় ${index + 1}: ${chapter.title}`;
      chaptersElement.appendChild(chapterItem);
    });

    readFreeChapterButton.addEventListener('click', () => {
      window.location.href = `free-chapter.html?id=${bookId}`;
    });

    purchaseBookButton.addEventListener('click', () => {
      window.location.href = `purchase-book.html?id=${bookId}`;
    });
  }

  db.collection('books').doc(bookId).get()
    .then((doc) => {
      if (doc.exists) {
        displayBookDetails(doc.data());
      } else {
        console.log('No such document!');
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });
});

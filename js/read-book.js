document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  const fontSizeSelector = document.getElementById('fontSize');
  const themeSelector = document.getElementById('theme');
  const bookContent = document.getElementById('bookContent');

  const book = ePub(`path/to/epub/${bookId}.epub`);
  const rendition = book.renderTo(bookContent, {
    width: '100%',
    height: '100%',
  });

  rendition.display();

  prevPageButton.addEventListener('click', () => {
    rendition.prev();
  });

  nextPageButton.addEventListener('click', () => {
    rendition.next();
  });

  fontSizeSelector.addEventListener('change', (event) => {
    const fontSize = event.target.value;
    rendition.themes.fontSize(fontSize);
  });

  themeSelector.addEventListener('change', (event) => {
    const theme = event.target.value;
    if (theme === 'light') {
      rendition.themes.default({
        body: {
          background: '#ffffff',
          color: '#000000',
        },
      });
    } else {
      rendition.themes.default({
        body: {
          background: '#000000',
          color: '#ffffff',
        },
      });
    }
  });
});

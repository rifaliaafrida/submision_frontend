 document.addEventListener('DOMContentLoaded', () => {
            const bookForm = document.getElementById('bookForm');
            const titleInput = document.getElementById('title');
            const authorInput = document.getElementById('author');
            const yearInput = document.getElementById('year');
            const isCompleteInput = document.getElementById('isComplete');
            const unfinishedList = document.getElementById('unfinishedList');
            const finishedList = document.getElementById('finishedList');
            const searchInput = document.getElementById('searchInput');

            bookForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addBook();
            });

            searchInput.addEventListener('input', function() {
                const searchTerm = searchInput.value.trim().toLowerCase();
                filterBooks(searchTerm);
            });

            function addBook() {
                const title = titleInput.value;
                const author = authorInput.value;
                const year = yearInput.value;
                const isComplete = isCompleteInput.checked;

                const book = {
                    id: +new Date(),
                    title,
                    author,
                    year,
                    isComplete,
                };

                const bookElement = createBookElement(book);
                if (isComplete) {
                    finishedList.appendChild(bookElement);
                } else {
                    unfinishedList.appendChild(bookElement);
                }

                saveToLocalStorage(book);
                clearForm();
            }

            function createBookElement(book) {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `<strong>Judul:${book.title}</strong>
                                  <p>Penulis:${book.author} </p>
                                  <p>Tahun:${book.year}</p>
                                  <p>Status: <span id="status-${book.id}">${book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca'}</span></p>                                 
                                   <button onclick="toggleBookStatus(${book.id})">Pindah Rak</button>
                                  <button onclick="editBook(${book.id})">Edit</button>
                                  <button onclick="deleteBook(${book.id})">Hapus</button>
                                 `;
                card.dataset.id = book.id;
                return card;
            }

            window.toggleBookStatus = function(bookId) {
                const books = getBooksFromLocalStorage();
                const book = books.find(book => book.id === bookId);
                book.isComplete = !book.isComplete;
                saveBooksToLocalStorage(books);
                updateBookStatus(bookId);
                renderBooks();
            };

            window.editBook = function(bookId) {
                const book = getBookById(bookId);
                titleInput.value = book.title;
                authorInput.value = book.author;
                yearInput.value = book.year;
                isCompleteInput.checked = book.isComplete;
                
                const bookElement = document.querySelector(`.card[data-id="${bookId}"]`);
                const parentShelf = book.isComplete ? finishedList : unfinishedList;
                parentShelf.removeChild(bookElement);

                deleteBookFromLocalStorage(bookId);
            };

            window.deleteBook = function(bookId) {
                let books = getBooksFromLocalStorage();
                books = books.filter(book => book.id !== bookId);
                saveBooksToLocalStorage(books);
                renderBooks();
            };

            function saveToLocalStorage(book) {
                const books = getBooksFromLocalStorage();
                books.push(book);
                saveBooksToLocalStorage(books);
            }

            function getBooksFromLocalStorage() {
                return JSON.parse(localStorage.getItem('books')) || [];
            }

            function saveBooksToLocalStorage(books) {
                localStorage.setItem('books', JSON.stringify(books));
            }

            function renderBooks() {
                unfinishedList.innerHTML = '';
                finishedList.innerHTML = '';

                const books = getBooksFromLocalStorage();
                books.forEach(book => {
                    const bookElement = createBookElement(book);
                    if (book.isComplete) {
                        finishedList.appendChild(bookElement);
                    } else {
                        unfinishedList.appendChild(bookElement);
                    }
                });
            }

            function clearForm() {
                titleInput.value = '';
                authorInput.value = '';
                yearInput.value = '';
                isCompleteInput.checked = false;
            }

            function updateBookStatus(bookId) {
                const statusElement = document.getElementById(`status-${bookId}`);
                if (statusElement) {
                    const book = getBookById(bookId);
                    statusElement.textContent = book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
                }
            }

            function filterBooks(searchTerm) {
                const books = getBooksFromLocalStorage();
                const filteredBooks = books.filter(book =>
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    book.year.toString().includes(searchTerm)
                );
                renderFilteredBooks(filteredBooks);
            }

            function renderFilteredBooks(filteredBooks) {
                unfinishedList.innerHTML = '';
                finishedList.innerHTML = '';

                filteredBooks.forEach(book => {
                    const bookElement = createBookElement(book);
                    if (book.isComplete) {
                        finishedList.appendChild(bookElement);
                    } else {
                        unfinishedList.appendChild(bookElement);
                    }
                });
            }

            function getBookById(bookId) {
                const books = getBooksFromLocalStorage();
                return books.find(book => book.id === bookId);
            }

            renderBooks();
        });
const books = require('../models/bookModel');
const authors = require('../models/authorModel');

function getNextBookId() {
    return books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
}

function findBookById(id) {
    return books.find(book => book.id === id);
}

function findAuthorById(id) {
    return authors.find(author => author.id === id);
}

function getAllBooks(req, res) {
    let result = books;

    const { genre, year } = req.query;

    if (genre) {
        result = result.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }

    if (year) {
        const yearNumber = Number(year);
        if (!Number.isNaN(yearNumber)) {
            result = result.filter(book => book.year === yearNumber);
        }
    }

    res.json(result);
}

function getBookById(req, res) {
    const id = Number(req.params.id);
    const book = findBookById(id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
}

function createBook(req, res) {
    const { title, authorId, genre, year } = req.body;

    if (!title || !authorId || !genre || !year) {
        return res.status(400).json({ error: 'Missing required fields: title, authorId, genre, year' });
    }

    const author = findAuthorById(Number(authorId));
    if (!author) {
        return res.status(400).json({ error: 'Author not found' });
    }

    const newBook = {
        id: getNextBookId(),
        title,
        authorId: Number(authorId),
        genre,
        year: Number(year)
    };

    books.push(newBook);
    res.status(201).json(newBook);
}

function updateBook(req, res) {
    const id = Number(req.params.id);
    const book = findBookById(id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, authorId, genre, year } = req.body;

    if (authorId !== undefined) {
        const author = findAuthorById(Number(authorId));
        if (!author) {
            return res.status(400).json({ error: 'Author not found' });
        }
        book.authorId = Number(authorId);
    }

    if (title !== undefined) book.title = title;
    if (genre !== undefined) book.genre = genre;
    if (year !== undefined) book.year = Number(year);

    res.json(book);
}

function deleteBook(req, res) {
    const id = Number(req.params.id);
    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deletedBook = books.splice(index, 1)[0];
    res.json(deletedBook);
}

function searchBooks(req, res) {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: 'Query parameter "title" is required' });
    }

    const searchTerm = title.toLowerCase();
    const result = books.filter(book => book.title.toLowerCase().includes(searchTerm));

    res.json(result);
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks
};

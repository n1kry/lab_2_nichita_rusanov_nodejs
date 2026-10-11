const authors = require('../models/authorModel');
const books = require('../models/bookModel');

function findAuthorById(id) {
    return authors.find(author => author.id === id);
}

function getAllAuthors(req, res) {
    res.json(authors);
}

function getAuthorById(req, res) {
    const id = Number(req.params.id);
    const author = findAuthorById(id);

    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }

    res.json(author);
}

function getBooksByAuthor(req, res) {
    const id = Number(req.params.id);
    const author = findAuthorById(id);

    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }

    const authorBooks = books.filter(book => book.authorId === id);
    res.json(authorBooks);
}

function getStatistics(req, res) {
    const totalBooks = books.length;
    const totalAuthors = authors.length;

    const genres = new Set(books.map(book => book.genre.toLowerCase()));
    const totalGenres = genres.size;

    const newestBook = books.reduce((newest, book) => (book.year > newest.year ? book : newest), books[0]);
    const oldestBook = books.reduce((oldest, book) => (book.year < oldest.year ? book : oldest), books[0]);

    res.json({
        totalBooks,
        totalAuthors,
        totalGenres,
        newestBook,
        oldestBook
    });
}

module.exports = {
    getAllAuthors,
    getAuthorById,
    getBooksByAuthor,
    getStatistics
};

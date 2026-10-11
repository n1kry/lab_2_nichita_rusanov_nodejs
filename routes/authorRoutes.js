const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/', authorController.getAllAuthors);
router.get('/:id/books', authorController.getBooksByAuthor);
router.get('/:id', authorController.getAuthorById);

module.exports = router;

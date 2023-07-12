const express = require('express');
const app = express();
const PORT = 3000;

// In-memory book inventory
let books = [];

// Middleware to parse JSON request bodies
app.use(express.json());

// Simple example of API key authentication
const apiKey = 'mysecretapikey';

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    const providedKey = req.header('x-api-key');
    if (providedKey !== apiKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
// Add Book Endpoint
app.post('/api/books', authenticate, (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }

    const newBook = { id: Date.now().toString(), title, author };
    books.push(newBook);

    return res.status(201).json(newBook);
});

// Remove Book Endpoint
app.delete('/api/books/:id', authenticate, (req, res) => {
    const bookId = req.params.id;
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    books.splice(bookIndex, 1);

    return res.sendStatus(204);
});

// Get Books Endpoint
app.get('/api/books', (req, res) => {
    return res.json(books);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
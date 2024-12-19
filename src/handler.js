const { nanoid } = require('nanoid');


const books = []; // Array untuk menyimpan data buku

// Handler untuk menyimpan buku
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: { bookId: id },
    }).code(201);
};

// Handler untuk mendapatkan semua buku dengan filter query parameters
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    // Filter berdasarkan query parameter "name"
    if (name) {
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // Filter berdasarkan query parameter "reading"
    if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }

    // Filter berdasarkan query parameter "finished"
    if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    // Format respons hanya menampilkan properti "id", "name", dan "publisher"
    const booksResponse = filteredBooks.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
    }));

    return h.response({
        status: 'success',
        data: {
            books: booksResponse,
        },
    }).code(200);
};


// Handler untuk menampilkan detail buku berdasarkan ID
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    return {
        status: 'success',
        data: { book },
    };
};

// Handler untuk mengubah data buku berdasarkan ID
const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const index = books.findIndex((b) => b.id === bookId);

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    const updatedAt = new Date().toISOString();
    books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

// Handler untuk menghapus buku berdasarkan ID
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((b) => b.id === bookId);

    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    books.splice(index, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);

const getReadingBooksHandler = (request, h) => {
    const readingBooks = books.filter((book) => book.reading === true).map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
    }));

    return h.response({
        status: 'success',
        data: {
            books: readingBooks,
        },
    }).code(200);
};

};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler, };
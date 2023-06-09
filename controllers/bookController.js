import { searchBooks, searchBooks1 } from '../api/google-books/bookAPI.js';
import { Book, User, Favorite } from '../database/models/index.js';
import { filterBooksData } from '../api/google-books/bookAPI.js';

export const searchByTitleOrAuthor = async (req, res) => {
  try {
    const { title } = req.params;

    //should be changed to searchBooks - currently best for testing puposes
    const books = await searchBooks1(title);
    return res.json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await searchBooks(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFans = async (req, res) => {
  try {
    const { id } = req.params;

    const favorites = await Favorite.findAll({
      where: { book_id: id },
      include: { model: User, as: 'user', attributes: ['id', 'username'] }
    });

    const fans = favorites.map(favorite => favorite.user);

    return res.json(fans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    return res.json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addBookHelper = async (bookData) => {
  if (!bookData) {
    throw new Error('Invalid book data');
  }

  const [book, created] = await Book.findOrCreate({
    where: { id: bookData.id },
    defaults: bookData
  });

  return { book, created };
};

export const addBook = async (req, res) => {
  try {
    const { book, created } = await addBookHelper(req.body);

    let message = 'Book added to database successfully';
    if (!created) {
      message = 'Book already exists in the database';
    }

    return res.json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, image } = req.body;

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.image = image || book.image;
    await book.save();

    return res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Favorite.destroy({ where: { book_id: id } });
    await book.destroy();

    return res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

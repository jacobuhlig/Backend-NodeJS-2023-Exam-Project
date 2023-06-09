import sequelize from '../connection.js';
import UserModel from './user.js';
import BookModel from './book.js';
import ReviewModel from './review.js';
import FavoriteModel from './favorite.js';

// Initialize models
const User = UserModel(sequelize);
const Book = BookModel(sequelize);
const Review = ReviewModel(sequelize);
const Favorite = FavoriteModel(sequelize);

const models = { User, Book, Review, Favorite };

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

sequelize.sync();

export { sequelize, User, Book, Review, Favorite };

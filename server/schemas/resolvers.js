const { signToken } = require('../utils/auth');
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {

    Query: {
        
        // Get a user data from db using user id
        me: async (parent, args, context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError('Please log in first');
        }

    },

    Mutation: {

        login: async (parent, { email, password }) => {

            // Sign token once user email and password are validated

            const user = await User.findOne( { email });
            if (!user) {
                throw new AuthenticationError('Incorrect user email')
            }
            const userPw = await user.isCorrectPassword(password);
            if(!userPw) {
                throw new AuthenticationError('Incorrect user password')
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, {username, email, password}) => {

            // Add new user info into database and sign Token
            const user = await User.create({username, email, password});
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    // Add a new book to the DB. Do not add if the new book has already been saved
                    { $addToSet: {savedBooks: book }},
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('Please log in first')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                
                // Search the book using bookId as a parameter and remove it from the DB
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('Please log in first if you want to remove the book');
        }
    }
  };
  
  module.exports = resolvers;
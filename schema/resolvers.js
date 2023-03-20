const usersModel = require('../codex/models/users');
const booksModel = require('../codex/models/books'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dateToString } = require('../codex/helpers/date');

const dotenv = require('dotenv');
dotenv.config();

const resolvers = {
    Query: {
        users: async (_, args, req) => {
            if(!req.isAuth){
                throw new Error("Sorry You not Authenticated");
            }
            try {
                const results =  await usersModel.find()
                return results.map(result => {
                    return {
                        ...result._doc,
                        _id: result.id,
                        createdAt: dateToString(result._doc.createdAt),
                        updatedAt: dateToString(result._doc.updatedAt)
                    }
                });
            } catch(err){
                throw err;
            }
        },

        getBooks: async () => { 
            try {
                const results = await booksModel.find()
                return results.map(result => {
                    return {
                        ...result._doc,
                        _id: result.id,
                        createdAt: dateToString(result._doc.createdAt),
                        updatedAt: dateToString(result._doc.updatedAt)
                    }
                });
            } catch(err){
                throw err;
            }
        },

        getBook: async (_, {id}) => {
            const results = await booksModel.findById(id);
            return {
                ...results._doc,
                _id: results.id,
                createdAt: dateToString(results._doc.createdAt),
                updatedAt: dateToString(results._doc.updatedAt)
            }
        },

        login: async (_, {username, password}) => {
            const userToken = await usersModel.findOne({username: username});
            if(!userToken){
                throw new Error("Username does not exist!");
            }
            const isEqual = await bcrypt.compare(password, userToken.password);
            if(!isEqual){
                throw new Error("Password not match!");
            }

            const token = jwt.sign({userId: userToken.id, username: userToken.username}, 'somesecretkey', {
                expiresIn: '1h'
            });

            return { userId: userToken.id, token: token, tokenExpire: 1};
        }
        
    },

    Mutation: {
        createUser: async (_, args, req) => {
            try {
                const {username, password} = args.user;
                const user = await usersModel.findOne({username: username})
                if(user){
                    throw new Error('Username Already Exist');
                }
                const hashedPassword = await bcrypt.hash(password, 12);

                const modelUsers = new usersModel({
                    username: username, 
                    password: hashedPassword
                });
                const results = await modelUsers.save()
                // return modelUsers;
                return {
                    ...results._doc,
                    _id: results.id,
                    createdAt: dateToString(results._doc.createdAt),
                    updatedAt: dateToString(results._doc.updatedAt)
                }
            }catch (err){
                throw err
            }
        },

        createBook: async (_, args, req) => {
            if(!req.isAuth){
                throw new Error("Sorry You not Authenticated");
            }
            try {
                const {title, desc} = args.book;
                const modelBooks = new booksModel({title, desc});
                const book =  await booksModel.findOne({title: title})
                if(book){
                    throw new Error("Book Title Already Exist");
                }
                const results = await modelBooks.save()
                return {
                    ...results._doc,
                    _id: results.id,
                    createdAt: dateToString(results._doc.createdAt),
                    updatedAt: dateToString(results._doc.updatedAt)
                }
            }catch(err){
                throw err
            }
        },

        updateBook: async (args, {id, book}, req) => {
            if(!req.isAuth){
                throw new Error("Sorry You not Authenticated");
            }
            const newBook = await booksModel.findByIdAndUpdate(id,{
                $set:book
            },{new: true});
            return newBook;
        },

        deleteBook: async (args, {id}, req) => {
            if(!req.isAuth){
                throw new Error("Sorry You not Authenticated");
            }
            await booksModel.findByIdAndDelete(id);
            return 'Books Successfully Deleted';
        },
    }
}

module.exports = { resolvers };
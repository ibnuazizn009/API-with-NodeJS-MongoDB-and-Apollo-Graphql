// const {defaultFieldResolver} = require('graphql');
// const {ApolloError, SchemaDirectiveVisitor} = require('apollo-server-express');

// export class IsAuthDirective extends SchemaDirectiveVisitor {
//     visitFieldDefinition(field) {
//         const {resolve = defaultFieldResolver} = field;

//         field.resolve = async function (...args){
//             let [_, {}, {
//                 user,
//                 isAuth
//             }] = args;

//             if(isAuth) {
//                 const result = await resolve.apply(this, args);
//                 return result;
//             }else{
//                 throw new ApolloError('Sorry You Unauthorized!!');
//             }
//         };
//     }
// };
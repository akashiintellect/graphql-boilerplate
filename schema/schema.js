const graphql = require('graphql');
const axios = require('axios');
const _ = require('lodash');
const conf = require('../config/config');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList
} = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields:()=>({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        // company:{
        //     type: CompanyType,
        //     resolve(parentValue){
        //         return axios.get(conf.service.companies+`${parentValue.companyId}`)
        //             .then(res=>res.data);
        //     }
        // }
        companyId:{type:GraphQLString}
    })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields:{
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        users:{
            type: new GraphQLList(UserType),
            resolve(parentValue){
                return axios.get(conf.service.users)
                    .then(res=> _.filter(res.data,{companyId:parentValue.id}))
            }
        }
    }
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args:{id :{type:GraphQLInt}},
            resolve( parentValue, args ) {
                return axios.get(conf.service.users+`${args.id}`)
                    .then(res=>res.data);
            }
        },
        users:{
          type:new GraphQLList(UserType),
          resolve(){
              return axios.get(conf.service.users)
                  .then(res=>res.data);
          }
        },
        companies:{
            type: new GraphQLList(CompanyType),
            resolve(){
                return axios.get(conf.service.companies)
                    .then(res=>res.data)
            }
        },
        companyUsers:{
            type:new GraphQLList(UserType),
            args:{companyId:{type:GraphQLString}},
            resolve(parentValue,args){
                return axios.get(conf.service.users)
                    .then(res => _.filter(res.data,{companyId: args.companyId}))
            }
        },
        company:{
            type : CompanyType,
            args : { companyId : { type : GraphQLString } },
            resolve(parentValue, args){
                return axios
                    .get(conf.service.companies+args.companyId)
                    .then(res => res.data)
            }

        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
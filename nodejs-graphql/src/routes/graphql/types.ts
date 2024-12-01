import { FastifyInstance } from 'fastify';
import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLInputObjectType,
} from 'graphql';

import { UserEntity } from '../../utils/DB/entities/DBUsers';

const PostEntityGraphQL = new GraphQLObjectType({
  name: 'PostEntityGraphQL',
  description: 'Post Entity GraphQL Object Type',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    userId: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const PostEntityCreateInputGraphQL = new GraphQLInputObjectType({
  name: 'PostEntityCreateInputGraphQL',
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const PostEntityUpdateInputGraphQL = new GraphQLInputObjectType({
  name: 'PostEntityUpdateInputGraphQL',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const UserEntityGraphQL = new GraphQLObjectType({
  name: 'UserEntityGraphQL',
  description: 'User Entity GraphQL Object Type',
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    lastName: { type: GraphQLString },
    firstName: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  }),
});

const UserEntityCreateInputGraphQL = new GraphQLInputObjectType({
  name: 'UserEntityCreateInputGraphQL',
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const UserEntityUpdateInputGraphQL = new GraphQLInputObjectType({
  name: 'UserEntityUpdateInputGraphQL',
  fields: {
    email: { type: GraphQLString },
    lastName: { type: GraphQLString },
    firstName: { type: GraphQLString },
  },
});

const ProfileEntityGraphQL = new GraphQLObjectType({
  name: 'ProfileEntityGraphQL',
  description: 'Profile Entity GraphQL Object Type',
  fields: () => ({
    id: { type: GraphQLString },
    sex: { type: GraphQLString },
    city: { type: GraphQLString },
    avatar: { type: GraphQLString },
    userId: { type: GraphQLString },
    street: { type: GraphQLString },
    country: { type: GraphQLString },
    birthday: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  }),
});

const ProfileEntityCreateInputGraphQL = new GraphQLInputObjectType({
  name: 'ProfileEntityCreateInputGraphQL',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLID) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const ProfileEntityUpdateInputGraphQL = new GraphQLInputObjectType({
  name: 'ProfileEntityUpdateInputGraphQL',
  fields: {
    sex: { type: GraphQLString },
    city: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    avatar: { type: GraphQLString },
    street: { type: GraphQLString },
    country: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  },
});

const MemberTypeEntityGraphQL = new GraphQLObjectType({
  name: 'MemberTypeEntityGraphQL',
  description: 'Member Type Entity GraphQL Object Type',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

const MemberTypeEntityUpdateInputGraphQL = new GraphQLInputObjectType({
  name: 'MemberTypeEntityUpdateInputGraphQL',
  fields: {
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

const getUserEntityWithConnectedEntitiesGraphQL = async (fastify: FastifyInstance) => new GraphQLObjectType({
  name: 'UserEntityWithConnectedEntitiesGraphQL',
  fields: () => ({
    user: {
      type: UserEntityGraphQL,
      resolve: async (p: UserEntity) => p,
    },
    posts: {
      type: new GraphQLList(PostEntityGraphQL),
      resolve: async ({ id }: UserEntity) => await fastify.db.posts.findMany({ key: 'userId', equals: id }),
    },
    profile: {
      type: ProfileEntityGraphQL,
      resolve: async ({ id }: UserEntity) => await fastify.db.profiles.findOne({ key: 'userId', equals: id }),
    },
    memberType: {
      type: MemberTypeEntityGraphQL,
      resolve: async ({ id }: UserEntity) => {
        const userProfileEntity = await fastify.db.profiles.findOne({ key: 'userId', equals: id });
        return !userProfileEntity ? userProfileEntity : await fastify.db.memberTypes.findOne({ key: 'id', equals: userProfileEntity.memberTypeId });
      },
    },
  }),
});

const getUsersEntityWithSubscribedToProfileGraphQL = async (fastify: FastifyInstance) => new GraphQLObjectType({
  name: 'UsersEntityWithSubscribedToProfileGraphQL',
  fields: {
    user: {
      type: UserEntityGraphQL,
      resolve: async (p: UserEntity) => p,
    },
    profile: {
      type: ProfileEntityGraphQL,
      resolve: async ({ id }: UserEntity) => await fastify.db.profiles.findOne({ key: 'userId', equals: id }),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserEntityGraphQL),
      resolve: async ({ id }: UserEntity) => await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: id }),
    },
  },
});

const getUserEntityWithSubscribedToUserPostsGraphQL = async (fastify: FastifyInstance) => new GraphQLObjectType({
  name: 'UserEntityWithSubscribedToUserPostsGraphQL',
  fields: {
    user: {
      type: UserEntityGraphQL,
      resolve: async (p: UserEntity) => p,
    },
    posts: {
      type: new GraphQLList(PostEntityGraphQL),
      resolve: async ({ id }: UserEntity) => await fastify.db.posts.findMany({ key: 'userId', equals: id }),
    },
    subscribedToUser: {
      type: new GraphQLList(UserEntityGraphQL),
      resolve: async ({ subscribedToUserIds }: UserEntity) => await Promise.all([
        ...subscribedToUserIds.map(async (id) => await fastify.db.users.findOne({ key: 'id', equals: id })),
      ]),
    },
  },
});

const getUsersEntityWithAllSubscriptionsGraphQL = async (fastify: FastifyInstance) => {
  const UsersEntityWithAllSubscriptionsGraphQL: GraphQLOutputType = new GraphQLObjectType({
    name: 'UsersEntityWithAllSubscriptionsGraphQL',
    fields: () => ({
      id: { type: GraphQLString },
      email: { type: GraphQLString },
      lastName: { type: GraphQLString },
      firstName: { type: GraphQLString },
      subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
      subscribedToUser: {
        type: new GraphQLList(UsersEntityWithAllSubscriptionsGraphQL),
        resolve: async ({ subscribedToUserIds }: UserEntity) => await Promise.all([
          ...subscribedToUserIds.map(async (id) => await fastify.db.users.findOne({ key: 'id', equals: id })),
        ]),
      },
      userSubscribedTo: {
        type: new GraphQLList(UsersEntityWithAllSubscriptionsGraphQL),
        resolve: async ({ id }: UserEntity) => await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: id }),
      },
    }),
  });
  return UsersEntityWithAllSubscriptionsGraphQL;
};

export {
  PostEntityGraphQL,
  UserEntityGraphQL,
  ProfileEntityGraphQL,
  MemberTypeEntityGraphQL,
  PostEntityCreateInputGraphQL,
  PostEntityUpdateInputGraphQL,
  UserEntityCreateInputGraphQL,
  UserEntityUpdateInputGraphQL,
  ProfileEntityCreateInputGraphQL,
  ProfileEntityUpdateInputGraphQL,
  MemberTypeEntityUpdateInputGraphQL,
  getUsersEntityWithAllSubscriptionsGraphQL,
  getUserEntityWithConnectedEntitiesGraphQL,
  getUsersEntityWithSubscribedToProfileGraphQL,
  getUserEntityWithSubscribedToUserPostsGraphQL,
};

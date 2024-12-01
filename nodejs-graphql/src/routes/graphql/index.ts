import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

import {
  parse,
  graphql,
  validate,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import * as graphqlDepthLimit from 'graphql-depth-limit';

import { graphqlBodySchema } from './schema';
import {
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
} from './types';

import { ERROR_MESSAGES } from '../../utils/error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request) {
      const validationRules = [graphqlDepthLimit(5)];
      const parsedBodyQuery = parse(request.body.query!);
      const UserEntityWithConnectedEntitiesGraphQL = await getUserEntityWithConnectedEntitiesGraphQL(fastify);
      const UsersEntityWithSubscribedToProfileGraphQL = await getUsersEntityWithSubscribedToProfileGraphQL(fastify);
      const UserEntityWithSubscribedToUserPostsGraphQL = await getUserEntityWithSubscribedToUserPostsGraphQL(fastify);
      const UsersEntityWithAllSubscriptionsGraphQL = await getUsersEntityWithAllSubscriptionsGraphQL(fastify);
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'AllGraphQLQueries',
          fields: {
            getPosts: {
              type: new GraphQLList(PostEntityGraphQL),
              resolve: async () => fastify.db.posts.findMany(),
            },
            getUsers: {
              type: new GraphQLList(UserEntityGraphQL),
              resolve: async () => fastify.db.users.findMany(),
            },
            getProfiles: {
              type: new GraphQLList(ProfileEntityGraphQL),
              resolve: async () => fastify.db.profiles.findMany(),
            },
            getMemberTypes: {
              type: new GraphQLList(MemberTypeEntityGraphQL),
              resolve: async () => fastify.db.memberTypes.findMany(),
            },
            getPostById: {
              type: PostEntityGraphQL,
              args: { id: { type: GraphQLID } },
              resolve: async (_, { id }) => {
                const postEntity = await fastify.db.posts.findOne({ key: 'id', equals: id});
                if (!postEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.POST_NOT_FOUND);
                }
                return postEntity;
              },
            },
            getUserById: {
              type: UserEntityGraphQL,
              args: { id: { type: GraphQLID } },
              resolve: async (_, { id }) => {
                const userEntity = await fastify.db.users.findOne({ key: 'id', equals: id});
                if (!userEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }
                return userEntity;
              },
            },
            getProfileById: {
              type: ProfileEntityGraphQL,
              args: { id: { type: GraphQLID } },
              resolve: async (_, { id }) => {
                const profileEntity = await fastify.db.profiles.findOne({ key: 'id', equals: id});
                if (!profileEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.PROFILE_NOT_FOUND);
                }
                return profileEntity;
              },
            },
            getMemberTypeById: {
              type: MemberTypeEntityGraphQL,
              args: { id: { type: GraphQLID } },
              resolve: async (_, { id }) => {
                const memberTypeEntity = await fastify.db.memberTypes.findOne({ key: 'id', equals: id});
                if (!memberTypeEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.MEMBER_TYPE_NOT_FOUND);
                }
                return memberTypeEntity;
              },
            },
            getUsersWithConnectedEntities: {
              type: new GraphQLList(UserEntityWithConnectedEntitiesGraphQL),
              resolve: async () => fastify.db.users.findMany(),
            },
            getUserWithConnectedEntities: {
              type: UserEntityWithConnectedEntitiesGraphQL,
              args: { id: { type: GraphQLID } },
              resolve: async (_, { id }) => {
                const userEntity = await fastify.db.users.findOne({ key: 'id', equals: id });
                if (!userEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }
                return userEntity;
              },
            },
            getUsersWithSubscribedToProfile: {
              type: new GraphQLList(UsersEntityWithSubscribedToProfileGraphQL),
              resolve: async () => fastify.db.users.findMany(),
            },
            getUserWithSubscribedToUserPosts: {
              type: UserEntityWithSubscribedToUserPostsGraphQL,
              args: { id: { type: GraphQLID } },
              resolve: async (_, { id }) => {
                const userEntity = await fastify.db.users.findOne({ key: 'id', equals: id });
                if (!userEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }
                return userEntity;
              },
            },
            getUsersWithAllSubscriptions: {
              type: new GraphQLList(UsersEntityWithAllSubscriptionsGraphQL),
              resolve: async () => fastify.db.users.findMany(),
            },
          },
        }),
        mutation: new GraphQLObjectType({
          name: 'AllGraphQLMutations',
          fields: {
            createPost: {
              type: PostEntityGraphQL,
              args: {
                variables: { type: new GraphQLNonNull(PostEntityCreateInputGraphQL) },
              },
              resolve: async (_, { variables: { userId, title, content } }) => {
                const userEntity = await fastify.db.users.findOne({ key: 'id', equals: userId });
                if (!userEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }
                return await fastify.db.posts.create({ userId, title, content });
              },
            },
            createUser: {
              type: UserEntityGraphQL,
              args: {
                variables: { type: new GraphQLNonNull(UserEntityCreateInputGraphQL) },
              },
              resolve: async (_, {  variables: { email, lastName, firstName } }) => fastify.db.users.create({ email, lastName, firstName }),
            },
            createProfile: {
              type: ProfileEntityGraphQL,
              args: {
                variables: { type: new GraphQLNonNull(ProfileEntityCreateInputGraphQL) },
              },
              resolve: async (
                _,
                { variables:
                  { userId, memberTypeId, avatar, sex, birthday, country, street, city },
                }
              ) => {
                const userEntity = await fastify.db.users.findOne({ key: 'id', equals: userId });
                if (!userEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }

                const memberTypeEntity = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });
                if (!memberTypeEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.MEMBER_TYPE_NOT_FOUND);
                }

                const userHasProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: userId });
                if (userHasProfile) {
                  throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_HAS_PROFILE);
                }

                return await fastify.db.profiles.create({
                  userId,
                  sex,
                  city,
                  birthday,
                  avatar,
                  street,
                  country,
                  memberTypeId,
                });
              },
            },
            updatePost: {
              type: PostEntityGraphQL,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                variables: { type: new GraphQLNonNull(PostEntityUpdateInputGraphQL) },
              },
              resolve: async (_, { id, variables }) => {
                const postEntity = await fastify.db.posts.findOne({ key: 'id', equals: id });
                if (!postEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.POST_NOT_FOUND);
                }
                return await fastify.db.posts.change(id, variables);
              },
            },
            updateUser: {
              type: UserEntityGraphQL,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                variables: { type: new GraphQLNonNull(UserEntityUpdateInputGraphQL) },
              },
              resolve: async (_, { id, variables }) => {
                const userEntity = await fastify.db.users.findOne({ key: 'id', equals: id });
                if (!userEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }
                return await fastify.db.users.change(id, variables);
              },
            },
            updateProfile: {
              type: ProfileEntityGraphQL,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                variables: { type: new GraphQLNonNull(ProfileEntityUpdateInputGraphQL) },
              },
              resolve: async (_, { id, variables }) => {
                const profileEntity = await fastify.db.profiles.findOne({ key: 'id', equals: id });
                if (!profileEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.PROFILE_NOT_FOUND);
                }

                const memberTypeEntity = await fastify.db.memberTypes.findOne({ key: 'id', equals: variables.memberTypeId });
                if (!memberTypeEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.MEMBER_TYPE_NOT_FOUND);
                }

                return await fastify.db.profiles.change(id, variables);
              },
            },
            updateMemberType: {
              type: MemberTypeEntityGraphQL,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                variables: { type: new GraphQLNonNull(MemberTypeEntityUpdateInputGraphQL) },
              },
              resolve: async (_, { id, variables }) => {
                const memberTypeEntity = await fastify.db.memberTypes.findOne({ key: 'id', equals: id });
                if (!memberTypeEntity) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.MEMBER_TYPE_NOT_FOUND);
                }
                return await fastify.db.memberTypes.change(id, variables);
              },
            },
            subscribeToUser: {
              type: UserEntityGraphQL,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                subscribeToUserId: { type: new GraphQLNonNull(GraphQLID) },
              },
              resolve: async (_, { id, subscribeToUserId }) => {
                const userEntityMain = await fastify.db.users.findOne({ key: 'id', equals: id });
                if (!userEntityMain) {
                  throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_NOT_FOUND);
                }

                const userEntityToSubscribe = await fastify.db.users.findOne(
                  { key: 'id', equals: subscribeToUserId }
                );
                if (!userEntityToSubscribe) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }

                const isInSubs = userEntityToSubscribe.subscribedToUserIds.includes(id);
                if (isInSubs) {
                  return userEntityToSubscribe;
                }
                return fastify.db.users.change(subscribeToUserId, {
                  subscribedToUserIds: [...userEntityToSubscribe.subscribedToUserIds, id],
                });
              },
            },
            unsubscribeFromUser: {
              type: UserEntityGraphQL,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLID) },
              },
              resolve: async (_, { id, unsubscribeFromUserId }) => {
                const userEntityMain = await fastify.db.users.findOne({ key: 'id', equals: id });
                if (!userEntityMain) {
                  throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_NOT_FOUND);
                }

                const userEntityToUnsubscribe = await fastify.db.users.findOne({ key: 'id', equals: unsubscribeFromUserId });
                if (!userEntityToUnsubscribe) {
                  throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
                }

                const indexOfSub = userEntityToUnsubscribe.subscribedToUserIds.findIndex((id) => id === unsubscribeFromUserId);
                if (indexOfSub === -1) {
                  throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_NOT_SUBSCRIBED);
                }

                userEntityToUnsubscribe.subscribedToUserIds.splice(indexOfSub, 1);

                const changedUserEntity = fastify.db.users.change(
                  unsubscribeFromUserId, { subscribedToUserIds: userEntityToUnsubscribe.subscribedToUserIds }
                );
                return changedUserEntity;
              },
            },
          },
        }),
      });
      const validationErrors = validate(schema, parsedBodyQuery, validationRules);
      if (validationErrors.length) {
        return { data: null, errors: validationErrors };
      }
      return await graphql({ schema, source: request.body.query as string });
    }
  );
};

export default plugin;

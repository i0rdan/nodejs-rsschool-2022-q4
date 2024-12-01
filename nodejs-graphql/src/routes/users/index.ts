import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { ERROR_MESSAGES } from '../../utils/error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<UserEntity[]> {
    const userEntities = fastify.db.users.findMany();
    return userEntities;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const userEntity = await fastify.db.users.findOne({ key: 'id', equals: request.params.id});
      if (!userEntity) {
        throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      return userEntity;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const userEntity = await fastify.db.users.create(request.body);
      return userEntity;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const userEntityToDeleteId = request.params.id;
      const userEntityToDelete = await fastify.db.users.findOne({ key: 'id', equals: userEntityToDeleteId });
      if (!userEntityToDelete) {
        throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const userEntityToDeleteFollowers = await fastify.db.users.findMany(
        { key: 'subscribedToUserIds', inArray: userEntityToDeleteId }
      );
      userEntityToDeleteFollowers.forEach(async (f) => {
        const indexOfSub = f.subscribedToUserIds.indexOf(request.params.id);

        f.subscribedToUserIds.splice(indexOfSub, 1);

        await fastify.db.users.change(f.id, { subscribedToUserIds: f.subscribedToUserIds});
      });

      const userEntityToDeleteProfile = await fastify.db.profiles.findOne(
        { key: 'userId', equals: userEntityToDeleteId }
      );
      if (userEntityToDeleteProfile) {
        await fastify.db.profiles.delete(userEntityToDeleteProfile.id);
      }

      const userEnityToDeletePosts = await fastify.db.posts.findMany(
        { key: 'userId', equals: userEntityToDeleteId }
      );
      userEnityToDeletePosts.forEach(async ({ id }) => {
        await fastify.db.posts.delete(id);
      });

      const deletedUserEntity = await fastify.db.users.delete(userEntityToDeleteId);
      return deletedUserEntity;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const userEntityMainId = request.params.id;
      const userEntityMain = await fastify.db.users.findOne({ key: 'id', equals: userEntityMainId });
      if (!userEntityMain) {
        throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const userEntityToSubscribeId = request.body.userId;
      const userEntityToSubscribe = await fastify.db.users.findOne(
        { key: 'id', equals: userEntityToSubscribeId }
      );
      if (!userEntityToSubscribe) {
        throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const isInSubs = userEntityToSubscribe.subscribedToUserIds.includes(userEntityMainId);
      if (isInSubs) {
        return userEntityToSubscribe;
      }
      return fastify.db.users.change(userEntityToSubscribeId, {
        subscribedToUserIds: [...userEntityToSubscribe.subscribedToUserIds, userEntityMainId],
      });
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      const userEntityMainId = request.params.id;
      const userEntityMain = await fastify.db.users.findOne({ key: 'id', equals: userEntityMainId });
      if (!userEntityMain) {
        throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const userEntityToUnsubscribeId = request.body.userId;
      const userEntityToUnsubscribe = await fastify.db.users.findOne({ key: 'id', equals: userEntityToUnsubscribeId });
      if (!userEntityToUnsubscribe) {
        throw fastify.httpErrors.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const indexOfSub = userEntityToUnsubscribe.subscribedToUserIds.findIndex((id) => id === userEntityMainId);
      if (indexOfSub === -1) {
        throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_NOT_SUBSCRIBED);
      }

      userEntityToUnsubscribe.subscribedToUserIds.splice(indexOfSub, 1);

      const changedUserEntity = fastify.db.users.change(
        userEntityToUnsubscribeId, { subscribedToUserIds: userEntityToUnsubscribe.subscribedToUserIds }
      );
      return changedUserEntity;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<UserEntity> {
      try {
        const changedUserEntity = await fastify.db.users.change(request.params.id, request.body);
        return changedUserEntity;
      } catch (err) {
        throw fastify.httpErrors.badRequest(err as string);
      }
    }
  );
};

export default plugin;

import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { ERROR_MESSAGES } from '../../utils/error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<
    ProfileEntity[]
  > {
    const profileEntities = fastify.db.profiles.findMany();
    return profileEntities;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const profileEntity = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id});
      if (!profileEntity) {
        throw fastify.httpErrors.notFound(ERROR_MESSAGES.PROFILE_NOT_FOUND);
      }
      return profileEntity;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const memberTypeEntity = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });
      if (!memberTypeEntity) {
          throw fastify.httpErrors.badRequest(ERROR_MESSAGES.MEMBER_TYPE_NOT_FOUND);
      }

      const userHasProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId });
      if (userHasProfile) {
        throw fastify.httpErrors.badRequest(ERROR_MESSAGES.USER_HAS_PROFILE);
      }

      const profileEntity = await fastify.db.profiles.create(request.body);
      return profileEntity;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      try {
        const deletedProfileEntity = await fastify.db.profiles.delete(request.params.id);
        return deletedProfileEntity;
      } catch (err) {
        throw fastify.httpErrors.badRequest(err as string);
      } 
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      try {
        const changedProfileEntity = await fastify.db.profiles.change(request.params.id, request.body);
        return changedProfileEntity;
      } catch (err) {
        throw fastify.httpErrors.badRequest(err as string);
      }
    }
  );
};

export default plugin;

import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { ERROR_MESSAGES } from '../../utils/error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<PostEntity[]> {
    const postEntities = fastify.db.posts.findMany();
    return postEntities;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity> {
      const postEntity = await fastify.db.posts.findOne({ key: 'id', equals: request.params.id});
      if (!postEntity) {
        throw fastify.httpErrors.notFound(ERROR_MESSAGES.POST_NOT_FOUND);
      }
      return postEntity;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request): Promise<PostEntity> {
      const postEntityUser = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      if (!postEntityUser) {
        throw fastify.httpErrors.badRequest(ERROR_MESSAGES.POST_NOT_FOUND);
      }

      const postEntity = await fastify.db.posts.create(request.body);
      return postEntity;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity> {
      try {
        const deletedPostEntity = await fastify.db.posts.delete(request.params.id);
        return deletedPostEntity;
      } catch (err) {
        throw fastify.httpErrors.badRequest(err as string);
      }      
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity> {
      try {
        const changedPostEntity = await fastify.db.posts.change(request.params.id, request.body);
        return changedPostEntity;
      } catch (err) {
        throw fastify.httpErrors.badRequest(err as string);
      }
    }
  );
};

export default plugin;

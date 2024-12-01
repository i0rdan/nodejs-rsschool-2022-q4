import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { ERROR_MESSAGES } from '../../utils/error-messages';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<
    MemberTypeEntity[]
  > {
    const memberTypeEntities = fastify.db.memberTypes.findMany();
    return memberTypeEntities;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity> {
      const memberTypeEntity = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.params.id});
      if (!memberTypeEntity) {
        throw fastify.httpErrors.notFound(ERROR_MESSAGES.MEMBER_TYPE_NOT_FOUND);
      }
      return memberTypeEntity;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity> {
      try {
        const changedMemberTypeEntity = await fastify.db.memberTypes.change(request.params.id, request.body);
        return changedMemberTypeEntity;
      } catch (err) {
        throw fastify.httpErrors.badRequest(err as string);
      }
    }
  );
};

export default plugin;

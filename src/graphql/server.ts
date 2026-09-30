import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { Express, json } from 'express';
import cors from 'cors';
import { loadTypeDefs } from './schema';
import { createResolvers, buildContext, GraphQLContext } from './index';

export async function attachGraphQLServer(app: Express, path = '/graphql'): Promise<ApolloServer<GraphQLContext>> {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs: loadTypeDefs(),
    resolvers: createResolvers(),
  });

  await server.start();

  app.use(
    path,
    cors(),
    json(),
    expressMiddleware(server, {
      context: async () => buildContext(),
    }),
  );

  return server;
}

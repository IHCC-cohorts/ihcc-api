import express from "express";
import morgan from "morgan";

//@ts-ignore
import { PORT, ES_HOSTS, ARRANGER_PROJECT_ID } from "config";
import { Client } from "@elastic/elasticsearch";
import getArrangerGqlSchema, { ArrangerGqlContext } from "getArrangerSchema";
import { ApolloServer } from "apollo-server-express";

(async () => {
  const esClient = new Client({
    nodes: ES_HOSTS,
  });

  const arrangerSchema = await getArrangerGqlSchema(esClient);

  const app = express();
  app.use(morgan("combined"));

  const apolloServer = new ApolloServer({
    // @ts-ignore ApolloServer type is missing this for some reason
    schema: arrangerSchema,
    context: ({ req }: { req: Request }): ArrangerGqlContext => ({
      es: esClient, // for arranger only
      projectId: ARRANGER_PROJECT_ID, // for arranger only
    }),
    introspection: true,
  });

  const graphqlPath = `/${ARRANGER_PROJECT_ID}/graphql`;
  console.log("Graphql endpoint available at: ", graphqlPath);
  apolloServer.applyMiddleware({
    app,
    path: graphqlPath,
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
})();

// GRAPHQL

import { ApolloServer } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import cors from "cors";
import { NotAuthorizedError } from "../modules/common/errors/not-authorized-error";
import { AuthenticationError } from "apollo-server";
import { GraphQLError } from "graphql";
import { JWT } from "../modules/auth/utils/jwt";
import { UserPayload } from "../modules/auth/middlewares/current-user";
import express from "express";

export interface MyContext {
  user?: UserPayload;
}

export const GraphqlInitialization = async (app: any, server: any) => {
  try {
    // GraphQ
    const graphqlServer = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
      // Install a landing page plugin based on NODE_ENV
    });

    await graphqlServer.start();

    app.use(
      "/graphql",
      (req: any, res: any, next: any) => {
        //if (!req.headers.authorization) throw new NotAuthorizedError();
        next();
      },

      cors<cors.CorsRequest>({
        origin: "http://localhost:3000",
        credentials: true,
      }),
      express.json(),
      expressMiddleware(graphqlServer, {
        context: async ({ req }) => {
          const jwt =
            req.cookies.jwt ||
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YmMwMTVmNzAwODAwYWNlMmZmYzAwNiIsIm5hbWUiOiJtb2hhbW1hZGIiLCJpYXQiOjE3MDgwMDI4MTV9.DrZqopBHKmDqnrMDievIFHcu1QNgrj8Y5pPfFI_wcDc";

          try {
            const payload = JWT.verify(jwt);
            return { user: payload };
            return {};
          } catch (err) {
            //throw new AuthenticationError("Not Authenticated");
            throw new GraphQLError("Not Authenticaed", {
              extensions: {
                exception: {
                  code: "UNAUTHENTICATED",
                },
                code: 401,
              },
            });
          }
        },
      })
    );
  } catch (err) {
    console.log(err);
  }
};

// import { ApolloServer } from '@apollo/server';

// import { startStandaloneServer } from '@apollo/server/standalone';

// interface MyContext {

//   // we'd define the properties a user should have

//   // in a separate user interface (e.g., email, id, url, etc.)

//   user: UserInterface;

// }

// const server = new ApolloServer<MyContext>({

//   typeDefs,

//   resolvers,

// });

// const { url } = await startStandaloneServer(server, {

//   // Note: This example uses the `req` argument to access headers,

//   // but the arguments received by `context` vary by integration.

//   // This means they vary for Express, Fastify, Lambda, etc.

//   // For `startStandaloneServer`, the `req` and `res` objects are

//   // `http.IncomingMessage` and `http.ServerResponse` types.

//   context: async ({ req, res }) => {

//     // Get the user token from the headers.

//     const token = req.headers.authorization || '';

//     // Try to retrieve a user with the token

//     const user = await getUser(token);

//     // Add the user to the context

//     return { user };

//   },

// });

// console.log(`🚀 Server listening at: ${url}`);

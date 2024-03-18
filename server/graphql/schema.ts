import { ApolloServer, gql } from "apollo-server";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

export const typeDefs = gql`
  ${require("fs").readFileSync(require.resolve("./schema.graphql"), "utf8")}
`;

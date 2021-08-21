---
title: GraphQL primer part two
date: 2018-10-14
tags: ['graphql', 'schema', 'api']
thumbnail: graphql.png
thumbnailBg: '#fce7f4'
published: true
---

Previously, I covered the basics of GraphQL schema definition including types, queries, and mutations. In part two I'll be diving into creating a GraphQL service and server with Prisma, MySQL, and Apollo Server.

<!--more-->

Previously: [GraphQL primer part one](/articles/2018/2018-10-05-graphql-primer-1)

I'll also be including two links to repos that can be used to follow along. The first has the base docker compose setup needed to get started. The other is the end result for the server. This article does assume some basic experience/knowledge with Docker. I've selected [Prisma](https://prisma.io) for this portion largely due to my familiarity. There are, however, other great projects such as [Hasura](https://hasura.io/) that offer similar features.

Prisma also creates a useful electron app, [graphql-playground](https://github.com/prisma/graphql-playground), that can be used to interact with the service here. Other's like GraphiQL can be used too.

## Preperation

[Docker can be obtained here.](https://www.docker.com/get-started) Follow the instructions to get it setup. After you've gotten Docker setup and authenticated with the Docker Hub you'll be able to install the images necessary for this portion.

I'm going to be placing the definition for the data layer inside the same project as the server. The basic directory structure in this case will be:

```
- database/
  - datamodel.graphql
  - docker-compose.yml
  - prisma.yml
- src/
  - index.js
  - schema.graphql
- .graphqlconfig.yml
```

The docker-compose.yml file will define two images one running our Prisma service and the other running our MySQL server. You can see it broken down in more detail within the Prisma docs and the one for this service is vanilla.

```yaml
version: '3'
services:
  prisma:
    image: prismagraphql/prisma:1.14
    restart: always
    ports:
      - '4466:4466'
    environment:
      PRISMA_CONFIG: |
        port: 4466
        databases:
          default:
            connector: mysql
            host: mysql
            port: 3306
            user: root
            password: prisma
            migrations: true
  mysql:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: prisma
    volumes:
      - mysql:/var/lib/mysql
volumes: mysql:
```

We also need a file to configure Prisma's external interface. In the same database directory we have a prisma.yml.

```yaml
endpoint: http://localhost:4466
datamodel: datamodel.graphql
```

That's it for the setup! Once you've got it set you can use the following command to pull the images and start your backend services.

```
docker-compose -f database/docker-compose.yml up -d
```

Now to actually writing our service.

# Writing a GraphQL service on top of MySQL

For quick reference here's the final schema that we created in part one.

```graphql
type Location {
  id: ID!
  name: String!
  cats: [Cat!]!
}

type Cat {
  id: ID!
  name: String!
  age: Int
  weight: Float
  breed: String
  location: Location
}

input LocationInput {
  name: String!
}

input CatInput {
  name: String!
  age: Int
  weight: Float
  breed: String
}

type Query {
  location(id: ID!): Location!
  cat(id: ID!): Cat!
  getLocations(): [Location]!
}

type Mutation {
  addLocation(input: LocationInput): Location!
  addCat(locationId: ID!, input: CatInput): Cat!
}

schema {
  query: Query
  mutation: Mutation
}
```

For our data access layer we need to break this down into the datamodel.graphql file that Prisma is going to process to build our access schema. In this case we don't actually need our input, query and mutation, or schema types. Prisma also introduces some specific directives to our schema that it uses to extend the data definitions. The one we'll be using in our case is `@unique`. There are others like [@default](<https://www.prisma.io/docs/1.4/reference/service-configuration/data-modelling-(sdl)-eiroozae8u#default-value>) and [@relation](<https://www.prisma.io/docs/1.4/reference/service-configuration/data-modelling-(sdl)-eiroozae8u#relations>).

## Prisma datamodel

In this case we only need our two main types: Location and Cat. Notice that I've added `@unique` to the `id` field. This will instruct Prisma that the field should be an auto increment key.

```graphql
# database/datamodel.graphql
type Location {
  id: ID! @unique
  name: String!
  cats: [Cat!]!
}

type Cat {
  id: ID! @unique
  name: String!
  age: Int
  weight: Float
  breed: String
  location: Location
}
```

That's it! Relatively simple for the case of this project. If you're following along you can place the contents of that snippet in `database/datamodel.graphql`. Once there you can deploy your datamodel to the dockerized Prisma service with the following command.

```
npx prisma deploy
```

If you've gotten green lights across the board then that means you have a working data layer mapped through Prisma to your MySQL server. If you've installed a GraphQL client you should be able to inspect the schema at `http://localhost:4466`. Take note about how this schema differs from our intended one. Prisma makes a lot of useful assumptions about how we want to faciliate interacting with our data. It provides a number of ORM like types for querying data. We will use this schema to write the server.

## Generated schema

The [graphql cli](https://github.com/graphql-cli/graphql-cli) provides a number of useful commands to work with schemas and services. In this case we need to generate the schema for the GraphQL server. It can even generate template projects for servers and clients. It's quite useful for getting started but we specifically want to focus on the `get-schema` command. It's going to allow us to generate a new schema file for our server. Before we do that, however, we need to create a `.graphqlconfig.yml` file.

### .graphqlconfig.yml

In the root directory of our server we'll create a `.graphqlconfig.yml' (or json, if you prefer) and provide it with two project directives`app`and`database`. You could potentially have any number of projects represented in a single file. This file is extremely useful in team situations. Many GraphQL application can use this project file to manage connections to your services. Here we're just describing the location of our schemas (generated and database) as well as the endpoint on which the server will eventually be running.

```yml
#.graphqlconfig.yml
projects:
  app:
    schemaPath: src/schema.graphql
    extensions:
      endpoints:
        default: http://localhost:4000
  database:
    schemaPath: src/generated/prisma.graphql
    extensions:
      prisma: database/prisma.yml
```

Here is graphql-playground after opening the project directory with the above .graphqlconfig. Two projects `app` and `database`, and the default configurations for them.

![GraphQL Playground](graphql_playground_1.png 'GraphQL Playground')

If you're interested in learning more about the graphql-config protocol checkout the [specification](https://github.com/prisma/graphql-config/blob/master/specification.md).

Now that our .graphqlconfig is ready you may noticed the `src/generated/prisma.graphl` and that there's no such file in our project yet.

If you run the following command:

```
❯ npx graphql get-schema --project database
```

You should see:

```
project database - Schema file was created: src/generated/prisma.graphql
```

Inspecting the generated/prisma.graphql file shows a rather lengthy and complex schema that we did not actually define. This generated schema is what Prisma exposes from our data layer. If you're using graphql-playground with the two services defined above running you can see this schema upon inspection.

![GraphQL Playground](graphql_playground_prisma.png 'GraphQL Playground')

It's not important to go over all that's created by the generated schema, but it is a good idea to familiarize yourself with it. A number of the types defined within it will be used to create our server.

# Writing a GraphQL server with Apollo Server

To keep things simple for our server we will only be adding two new files. An index.js file and the rest of our schema. Up until now we've only been supplying the Prisma service with the data portions of our schema: Locations and Cats. Now we need to take the input types, queries, and mutations, and let Apollo Server know about them. Because the schema is interpreted at runtime and the Locations and Cats of our schema exist outside of the application side we need another package [graphql-import](https://github.com/prisma/graphql-import) to allows us to import types from one schema to another.

## The rest of the schema

In the `src` directory create a `schema.graphql` file with the following contents. Here we're bringing the application side of our schema together with the data size. As mentioned before `graphql-import` is going to parse the schema and interpret the generated types at runtime.

```graphql
# import Location from './generated/prisma.graphql'
# import Cat from './generated/prisma.graphql'

input LocationInput {
  name: String!
}

input CatInput {
  name: String!
  age: Int
  weight: Float
  breed: String
}

type Query {
  location(id: ID!): Location!
  cat(id: ID!): Cat!
  getLocations: [Location]!
}

type Mutation {
  addLocation(input: LocationInput): Location!
  addCat(locationId: ID!, input: CatInput): Cat!
}

schema {
  query: Query
  mutation: Mutation
}
```

## Resolvers

Now that we're about to write the server for our data we begin talking about resolvers. At a most basic level a resolver is just a function that resolves a field. Often enough a function that queries a database. They can exist at both the client and server side (depending on your setup) and be used to resolve any type including custom scalars, and most commonly queries and mutations.

> Resolvers are functions that resolve data to a field.

If you've been following along from the base repository linked at the beginning of this article you've probably noticed a bare bones index.js in src. It looks something like this:

```typescript
// src/index.js
const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');
const { Prisma } = require('prisma-binding');
const path = require('path');

const resolvers = {};

const server = new ApolloServer({
  typeDefs: importSchema(path.resolve('src/schema.graphql')),
  resolvers,
  context: (req) => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466',
    }),
  }),
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🐈  🐈  🐈  ready at ${url}`);
});
```

There's no magic here. We're creating an Apollo Server at port 4000. I've imported importSchema from graql-import to handle the custom imports within our application schema. And I'm also providing custom context to each request in the form of a Prisma instance. I've specifically left the resolvers object literal empty in order to define them now. Apollo Server will use the keys in the resolvers map to bind resolution of fields. For example, if we look at our application schema we only have two types we need to worry about creating resolvers for at this time: Query and Mutation. The key to graphql type binding is 1:1 so if we update the resolvers map to something like:

```typescript
const resolvers = {
  Query: {},
};
```

We are actually informing Apollo Server of the resolution of the Query type in our schema. I'm sure you can guess what's next. Defining the functions that resolve to the queries. All resolvers for Apollo Server have the following signature:

```typescript
fieldName(obj, args, context, info) { result }
```

A quick breakdown of the parameters for a resolver...
`obj` - The result returned from a resolver of a parent field. In the case of nested fields this parameter provides further resolution for children.
`args` - Object containing key value pairs of arguments passed to the query.
`context` - Shared execution context from Apollo Server. In the case of our server this is where Prisma will be accesible.
`info` - Contains information about the execution state of the query.

### Query resolvers

In the application schema we have three queries and our stubbed out resolvers can look something like:

```typescript
const resolvers = {
  Query: {
    location: (obj, args, context, info) => {},
    cat: (obj, args, context, info) => {},
    getLocations: (obj, args, context, info) => {},
  },
};
```

Of course, these won't function as is. We need to actually specify the resolution. In this case we're querying Prisma based on the generated schema. We do so through the `context` object. You can inspect the schema from Prisma to determine which fields need to be queried. For our queries we will just be using the `location`, `cat`, and `locations` types. You can also see what arguments the generated schema provides.

![GraphQL Playground](graphql_playground_where.png 'Prisma where argument')

For our location query resolver we can use the `where` argument from Prisma's schema to limit the results.

```typescript
const resolvers = {
  Query: {
    location: (obj, args, context, info) => {
      return context.prisma.query.location(
        {
          where: { id: args.id },
        },
        info
      );
    },
    cat: (obj, args, context, info) => {},
    getLocations: (obj, args, context, info) => {},
  },
};
```

We now have one working resolver for our location query. It will take the id argument, query Prisma, which in turn queries MySQL, and resolves our location. Continuing, our query resolvers will look something like:

```typescript
const resolvers = {
  Query: {
    location: (obj, args, context, info) => {
      return context.prisma.query.location(
        {
          where: { id: args.id },
        },
        info
      );
    },
    cat: (obj, args, context, info) => {
      return context.prisma.query.cat(
        {
          where: { id: args.id },
        },
        info
      );
    },
    getLocations: (obj, args, context, info) => {
      return context.prisma.query.locations({}, info);
    },
  },
};
```

### Mutation resolvers

I've shown what makes up a resolver for a query. Mutations are really not so different. They're still using Prisma to add or modify data.

```typescript
const resolvers = {
  Query: {...},
  Mutation: {
    addCat: (obj, args, context, info) => {
      return context.prisma.mutation.createCat(
        {
          data: {
            name: args.input.name,
            age: args.input.age,
            weight: args.input.weight,
            breed: args.input.breed,
            location: {
              connect: {
                id: args.locationId
              }
            }
          }
        },
        info
      );
    },
    addLocation: (obj, args, context, info) => {
      return context.prisma.mutation.createLocation(
        {
          data: {
            name: args.input.name
          }
        },
        info
      );
    }
  }
};
```

Here I'm mapping the input type arguments to the data object for the createCat and createLocation mutations. The result of the operation will be the resolved object (based on our schema).

## Wrapping up

With the resolvers defined the server can function as expected. The example repository for this includes `nodemon` so you could run `npx nodemon src/index.js` to start the server. If you were to use graphql-playground to open the project directory (with the .graphqlconfig.yml file) you would see a two viable graphql schemas at the endpoints provided. One, the server, at 4000 and Prisma at 4466.

In summation the server should look something like this:

```typescript
const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');
const { Prisma } = require('prisma-binding');
const path = require('path');

const resolvers = {
  Query: {
    location: (obj, args, context, info) => {
      return context.prisma.query.location(
        {
          where: { id: args.id },
        },
        info
      );
    },
    cat: (obj, args, context, info) => {
      return context.prisma.query.cat(
        {
          where: { id: args.id },
        },
        info
      );
    },
    getLocations: (obj, args, context, info) => {
      return context.prisma.query.locations({}, info);
    },
  },
  Mutation: {
    addCat: (obj, args, context, info) => {
      return context.prisma.mutation.createCat(
        {
          data: {
            name: args.input.name,
            age: args.input.age,
            weight: args.input.weight,
            breed: args.input.breed,
            location: {
              connect: {
                id: args.locationId,
              },
            },
          },
        },
        info
      );
    },
    addLocation: (obj, args, context, info) => {
      return context.prisma.mutation.createLocation(
        {
          data: {
            name: args.input.name,
          },
        },
        info
      );
    },
  },
};

const typeDefs = importSchema(path.resolve('src/schema.graphql'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466',
    }),
  }),
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🐈  🐈  🐈  ready at ${url}`);
});
```

This is a relatively straight forward server and schema. In some situations future resolvers could be defined for nested types but in general the Prisma generated schema fits most situations. You may also notice that all of queries to Prisma include the info arugment. This allows Prisma to determine the context of the query and resolve types based on its own schema.

By now I've been mentioning [graphql-playground](https://github.com/prisma/graphql-playground) at length. Largely because it's quite useful for someone working in a team with a project that has multiple application schemas. There are others like graphiql that work just as well. Each have standalone desktop applications (if you prefer that).

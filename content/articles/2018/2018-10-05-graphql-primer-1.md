---
title: GraphQL primer part one
date: 2018-10-05
tags: ['graphql', 'schema', 'api']
thumbnail: graphql.png
thumbnailBg: '#fce7f4'
---

In November I'll be giving a talk about GraphQL to the Asheville Javascript Developers group. From schema definition to its use in today's applications. This is part one of three of what will become that talk.

<!--more-->

# Table of contents

- [Introduction](/2018-10-05-graphql-primer-1#Introduction)
- [Schema: types, queries, and mutations](/2018-10-05-graphql-primer-1#Schema)
  - [Scalar types](/2018-10-05-graphql-primer-1#schema-scalar)
  - [Object types](/2018-10-05-graphql-primer-1#schema-object)
  - [Queries](/2018-10-05-graphql-primer-1#schema-queries)
  - [Mutations](/2018-10-05-graphql-primer-1#schema-mutations)
- Writing a GraphQL service and server on top of MySQL
- Querying: fetch, GraphiQL, and other clients
- Apollo client
- Queries in react-apollo
- Mutations in react-apollo
- Schema: Subscriptions
- Serverless GraphQL with AWS Appsync
- Do you need this in your stack?

<a name="Introduction"></a>

# Introduction

I'm in an incredibly fortunate position with my job where I can freely suggest that we approach newer technologies to help solve our problems. One of those technologies, that's on the tip of every developer's tongue these days, is GraphQL. It's not that new. As of right now GraphQL is 3 years old, having been released in 2015. However, even in Asheville you can't throw a stick without hitting at least one dev expounding the merits and sometime frustrations of GraphQL.

These articles are intented to be a primer for anyone new or interested in GraphQL. If you consider yourself adept or masterful in GraphQL you may not find the first few portions of these articles very interesting.

At Firefly XD we manage a rather large React and Redux web application. The vast majority of its interactions with internal services are handled through REST-like endpoints. We don't have a lot of robust paramaterized filtering. Our usuage of GraphQL isn't largely to manage big portions of the application, instead we rely on it (and AWS AppSync) to faciliate our rapid prototyping process. I'll go in to further details about that later.

> GraphQL is a data query and manipulation language, and a runtime for handling those queries.

I'm a huge proponent of using whatever technology solves the problem quickly, expressively, and with minimal overhead. Part of the excitement of GraphQL isn't necessarily that it's just new, but that there are powerful services like AppSync and Prisma that faciliate the data access layer leaving the developer to simply write queries. Like any technology it's important to apply a critical lens when approaching it. Services like GraphQL, while useful and full of hype, may not necessarily be the best solution for your problem. There are a great many articles discussing the pros and cons of GraphQL (I strongly suggest searching for them if you're on the fence) and this article is really just intended to support my talk.

<a name="Schema"></a>

# Schema: types, queries, and mutations

Your schema defines the shape and relationship of your data. It specifies the type values of fields returned by queries, providing queries and mutations with arguments and their returns. As we'll see later there are services like AppSync and Prisma that can use your schema to help map data to its source.

For our service imagine we're creating a cat adoption agency management application. We need to store adoption agency locations and the cats that they shelter.

<a name="schema-scalar"></a>

## Scalar types

When defining your schema each field is assigned a type. GraphQL supports five scalar types `Int`, `Float`, `Boolean`, `String`, and `ID`. Ending a type definition with an exclaimation mark indicates that the field is non-nullable. Wrapping a type definition in square brackets indicates a list of that type.

```
name: String  # the field name may be null
name: String! # the field name may not be null
cats: [Cats]  # the field cats is a list of Cats
```

<a name="schema-object"></a>

## Object types

Imagine that we wanted to create a type that described a cat. This cat has a name, a weight, an age, and a breed. To do this we define an object type.

```graphql
type Cat {
  name: String!
  age: Int
  weight: Float
  breed: String
}
```

Our cat object type has four fields made up of different scalars. The name field is the only field that cannot be null.

```graphql
type Location {
  id: ID!
  name: String!
  cats: [Cat!]!
}
```

We want to represent the relationship of an agency location to the cats in their care. I've defined another object type called `Location` that has an id, name, and list of cats. Note the placement of the exclaimation mark on `[Cat!]!`. This specifies that the field cats will be a non-nullable list that must contain a at least one cat. We should also go ahead and update our cat object to further this relationship. Ensuring that if we only have a cat we can easily resolve at which location the cat is sheltered.

```graphql
type Cat {
  id: ID!
  name: String!
  age: Int
  weight: Float
  breed: String
  location: Location
}
```

The cat type will probably need an id field at some point and we may want to resolve the location of an individual cat.

<a name="schema-queries"></a>

## Queries

By convention we generally create an object type called Query that defines a queries for our schema. The definition of a query is much like that of a field on any other object type (in fact fields on any object type can have arguments).

```graphql
type Query {
  location(id: ID!): Location!
  cat(id: ID!): Cat!
  getLocations(): [Location]!
}
```

At this point our Query object contains three queries: `location`, `cat`, and `getLocations`. These queries will allow us to get a list of locations, a single location, and a single cat. The stucture of GraphQL allows us to break down our types by field. Whatever exists at the application level can then specify the data it needs.

```graphql
{
  location(id: 42) {
    name
    cats {
      id
      name
      breed
    }
  }
}
```

Writing queries for execution names the fields we want. In this case we're getting the agency name, and the ids, names, and breeds of the cats at location 42.

You may also write a query as follows:

```graphql
query {
  location(id: $id) {
    name
    cats {
      id
      name
      breed
    }
  }
}
```

## Named queries

While the regular query syntax works fine for some situations most applications are going to need provided execution context for queries. GraphQL clients and servers provide named queries support. I'll go into more detail about its implementation but it functions largely as a value interpolation mechanism.

```graphql
query GetLocation($id: ID!) {
  location(id: $id) {
    name
    cats {
      id
      name
      breed
    }
  }
}
```

The named query here is `GetLocation` and it takes an id value and passes that value into the same location query.

<a name="schema-mutations"></a>

## Mutations

In GraphQL a query that changes something is called a mutation. Mutations, much like queries, are defined in an object type named Mutation.

```graphql
input LocationInput {
  name: String!
}

input CatInput {
  name: String!
  age: Int
  weight: Float
  breed: String
}

type Mutation {
  addLocation(input: LocationInput): Location!
  addCat(locationId: ID!, input: CatInput): Cat!
}
```

Notice that I've also introduced a new organizational type called an input type. Input types allow you to specify multiple fields as an object type passed to a single field. In the case of these two mutations each takes an argument of input that have values mapped to different input types.

## Mutation execution

Executing a mutution is similar to the named query above, and like the named queries we will see later that these named mutations are also available through our client.

```graphql
mutation AddLocation($input: LocationInput!) {
  addLocation(input: $input) {
    id
    name
  }
}

mutation AddCat($locationId: ID!, $input: CatInput!) {
  addCat(locationId: $locationId, input: $input) {
    id
    name
    breed
  }
}
```

In some cases returning an id or a success boolean on add might be sufficient. Here I've opted to return fields that will be beneficial in updating UI based on the newly added Location and Cat.

## Recap and the schema

We've defined two types, two queries, and two mutations that will eventually allow our application to get and add Locations and Cats. All together our schema looks like the following. I've also defined a new `schema` type. Many services like AWS AppSync don't require that you provide a schema type. If you have a type named Query or Mutation it will default its execution of the schema to those types.

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

There's a great deal more that can be done with GraphQL. I've kepted it simple here to outline the basics.

In part two of this article I'll be creating creating a GraphQL server on top of Prisma and MySQL. Detailing how we can take our current schema, turn it into a relational database schema, and then use Prisma to faciliate the inbetweens of Apollo Server and MySQL.

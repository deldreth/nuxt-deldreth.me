---
title: Rapid prototyping with AWS AppSync and serverless
date: 2018-10-07
tags: ['30 minutes', 'graphql', 'serverless', 'aws appsync']
thumbnail: appsync.png
thumbnailBg: '#5075F780'
published: true
---

Sometimes you need to be able to prototype an application or portion of one quickly and your data/access layer shouldn't get in the way. Fortunately, AWS AppSync makes this wholly simple.

<!--more-->

# Write your serverless configuration

You can potentially get away with just two packages:

```
npm install --save-dev serverless serverless-appsync-plugin
```

By now there are hundreds of articles on serverless' framework of the same name. You can also [check out the documentation](https://serverless.com/). Servleress ships with a CLI tool you can use to spin up your configurations from a number of templates to suit your environment. I'm not going to get into them, but we're going to be using Node 8.10. In many cases I've found that the templates are a little more robust that my needs and I tend prefer to keep it simple.

Also, repo for [serverless-appsync-plugin](https://github.com/sid88in/serverless-appsync-plugin).

```yaml
service:
  name: rapid-prototyping

plugins:
  - serverless-appsync-plugin

provider:
  name: aws
  runtime: nodejs8.10
  stage: ${opt:stage, 'dev'}
  region: us-east-1
```

The provider definition is important. It's going to tell serverless you're using aws, node 8.10, and your default region is us-east-1. The stage setting here is using one of serverless' many interpolation functions. In this case `opt:stage` refers to a CLI argument of stage but it will default to `dev`. If you're familiar with using the AWS cli then you probably already have a profile setup. You can append the `profile` alias to the provider here too, otherwise, the default will be used.

## Configure serverless-appsync-plugin

Next you'll want to add the beginnings of your AppSync configuration.

```yaml
custom:
  accountId: # Your AWS account id
  appSync:
    name: ${self:provider.stage}-rapid-prototypes-ftw
    authenticationType: API_KEY
```

serverless-appsync-plugin is going to read these specific values as part of its lifecycle. Note that I've actually used another interpolation method to prepend the stage value to the actual deploy. In most quick cases this is fast enough for me. However, if you prefer IAM role based separation of deployables then that's great too!

> AppSync uses DynamoDB's template mapping and resolution layer. Meaning that you can simply define mappings to your data and associate them with your schema.

# Create your template mapping

Start by creating a directory in your project, serverless-appsync-plugin defaults to `mapping-templates`. Within that directory create two files: `Cat.request` and `Cat.response`. Obviously the extensions here are my convenience and in some cases a generic response file may be helpful to keep things simple.

I'm going to keep this example simple and say that the request only returns a single cat. So our Cat.request could look something like this:

```json
// Cat.request
{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key": {
    "id": { "S": "${context.arguments.id}" }
  }
}
```

Without going into great detail about DynamoDB's [mapping templates](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html), this will map the argument of id to the request and execute a DynamoDB Get on the record.

Our Cat.response file is relatively simple:

```
$util.toJson($context.result)
```

The request will return a json encoded instance of whatever Cat we attempted to Get.

## Update your serverless config with these mappings

Now that we've a basic mapping template we can update our serverless configuration to use it.

```yaml
custom:
  accountId: # Your AWS account id
  appSync:
    name: ${self:provider.stage}-rapid-prototypes-ftw
    authenticationType: API_KEY
    mappingTemplates:
      - dataSource: ${self:provider.stage}Cats
        type: Query
        field: cat # maps to the query name in your schema
        request: Cat.request
        response: Cat.response
    serviceRole: 'Dynamo-AppSyncServiceRole'
    dataSources:
      - type: AMAZON_DYNAMODB
        name: ${self:provider.stage}Cats
        description: 'Cats table'
        config:
          tableName: ${self:provider.stage}-Cats
          serviceRoleArn: 'arn:aws:iam::${self:custom.accountId}:role/Dynamo-AppSyncServiceRole'
```

This is everything that serverless-appsync-plugin needs to deploy your service. Note that in my situation the ARN for the role has already been created through the CLI or Console. You can define roles in the resources section of a serverless config and then reference them with Attribute functions.

# Define your DynamoDB resource with serverless

One of the extremely useful things about rapid prototyping this way is that you can many different types of resources related to your service. In situations where you're done testing or you no longer need the service you can destroy the entire deployment in one go. This is especially useful for managing your DynamoDB tables.

```yaml
resources:
  Resources:
    CatsTable:
      Type: 'AWS::DynamoDB::Table'
      Properties:
        TableName: ${self:provider.stage}-Cats
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

This last portion of our configuration will instruct serverless to create a new DynamoDB table `<stage>-Cats` with a single string index of id.

# Schema and deploy

serverless-appsync-plugin, by default, expects a schema.graphql file at the root of your project. For brevity I'm just going to add a single type and a query.

```graphql
# schema.graphql

type Cat {
  id: ID!
  name: String!
}

type Query {
  cat(id: ID!): Cat
}

schema {
  query: Query
}
```

Now, we're set to deploy our service.

```
npx serverless deploy --stage dev
```

It's that simple!

# Serverless configuration

```yaml
service:
  name: rapid-prototyping

plugins:
  - serverless-appsync-plugin

provider:
  name: aws
  runtime: nodejs8.10
  stage: ${opt:stage, 'dev'}
  region: us-east-1

custom:
  accountId: # Your AWS account id
  appSync:
    name: ${self:provider.stage}-rapid-prototypes-ftw
    authenticationType: API_KEY
    mappingTemplates:
      - dataSource: ${self:provider.stage}Cats
        type: Query
        field: cat # maps to the query name in your schema
        request: Cat.request
        response: Cat.response
    serviceRole: 'Dynamo-AppSyncServiceRole'
    dataSources:
      - type: AMAZON_DYNAMODB
        name: ${self:provider.stage}Cats
        description: 'Cats table'
        config:
          tableName: ${self:provider.stage}-Cats
          serviceRoleArn: 'arn:aws:iam::${self:custom.accountId}:role/Dynamo-AppSyncServiceRole'

resources:
  Resources:
    CatsTable:
      Type: 'AWS::DynamoDB::Table'
      Properties:
        TableName: ${self:provider.stage}-Cats
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

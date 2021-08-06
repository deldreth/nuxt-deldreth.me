---
title: Filtering Gatsby blog results
date: 2018-09-19
tags: ['graphql', 'gatsby', 'react']
thumbnail: gatsby.png
thumbnailBg: '#FFF6FF'
---

Gatsby ships and uses an incredibly powerful transformer built on top of remark to allow one to filter results based on front matter and other parts of parsed markdown.

<!--more-->

**tl;dr, [show me the queries](#queries)**

Gatsby tells you to inspect your site's data and schema the moment it spins up a dev instance. It's here that you can find the breakdown queries such as `allMarkdownRemark`. Underneath Gatsby's robust generated schema for your site are a series of resolvers that map to filters for matching, sorting, etc.

If we inspect our schema, specifically `allMarkdownRemark` we can see:

```
MarkdownRemarkConnection

skip: Int
limit: Int
sort: markdownRemarkConnectionSort
filter: filterMarkdownRemark
```

If we look dive into filterMarkDownRemark type we'll see a series of properties relative to our app's instance:

```
...
frontmatter: markdownRemarkConnectionFrontmatterInputObject_2
...
```

Gatsby is generating and resolving an AST upon some predetermined groups of filters based on field type. In the case of front matter for this site we can see that the `markdownRemarkConnectionFrontmatterInputObject_2` has been generated as:

```
title: markdownRemarkConnectionFrontmatterTitleQueryString_2
date: markdownRemarkConnectionFrontmatterDateQueryString_2
tags: markdownRemarkConnectionFrontmatterTagsQueryList_2
_PARENT: markdownRemarkConnectionFrontmatterParentQueryString_2
thumbnail: markdownRemarkConnectionFrontmatterThumbnailQueryString_2
published: markdownRemarkConnectionFrontmatterPublishedQueryBoolean_2
```

From here these types are bound operators to resolvers being executed around [sift](https://github.com/crcn/sift.js). The available operators will depend upon the type of the front matter field's value. In the case of published (a boolean) the generated type name is relative to the field's value's type.

```
markdownRemarkConnectionFrontmatterPublishedQueryBoolean_2

fields
eq: Boolean
ne: Boolean
in: [Boolean]
nin: [Boolean]
```

<a name="queries"></a>

## Querying fields examples

Now that we've seen how the types are broken down we can begin to construct queries specific to our front matter.

All markdown remarks where published is not false. In this case I didn't want to go back and add the published field to all my front matter. Allowing it to be undefined or true in this case.

```graphql
{
  allMarkdownRemark(filter: { frontmatter: { published: { ne: false } } }) {
    edges {
      node {
        frontmatter {
          title
          published
        }
      }
    }
  }
}
```

Or, where published is not equal false and tag contains `graphql` or `react`:

```graphql
{
  allMarkdownRemark(
    filter: {
      frontmatter: {
        published: { ne: false }
        tags: { in: ["graphql", "react"] }
      }
    }
  ) {
    edges {
      node {
        frontmatter {
          title
          published
          tags
        }
      }
    }
  }
}
```

## Takeaway

There's a lot of power provided in Gatsby's relationship with GraphQL. One that further expounds the philosophy of GraphQL's "write queries, not code" philosophy.

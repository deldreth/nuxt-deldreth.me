---
title: Avl Tips
date: 2020-04-04
tags: ['react', 'web components', 'aws']
thumbnail: apps/avl.tips.png
thumbnailBg: '#d8f1d0'
link: https://avl.tips/
github: https://github.com/deldreth/avl-tips
published: false
---

"Help the Asheville Service Industry". With in the onset of the pandemic in 2020 service industry employees experienced excess layoffs. Having personally known a number of folks within the Asheville metro area I decided to create this simple little app. At a basic level, it allows generous people that would be dining or drinking in public donate a "tip" to someone random that was experiencing financial hardship.

<!--more-->

As of the beginning of 2021 there were just under 1000 registrations from Asheville service industry employees.

## Concept

Service industry employees that are current out of work are able to sign up via a Google Docs Sheet form and provide handles for Cash, Venmo, and Paypal.me.

## Technology

The tech stack for this application ended up being pretty rudimentary. Registration is provided through a Google Docs Sheet form which is synced via Docs script to an AWS s3 bucket. The s3 bucket is then access via a serverless lambda which provides a randomized and IP cached set of employee information.

# Serverless Shopify App
This is a reference project to display how to create a Shopify App that is served from AWS using Lambda. Sound simple eh? Read on dear reader.

To build the Shopify App we'll use Node, React, Next and Koa. For the purposes of this reference app there will be very little server(less) side processing being done, but it is there so the app can be extended and made to be  more useful. 

The AWS side of things will be handled by serverless framework CLI and a few plugins to help us with specific functions.

## Pre-requesites

**An AWS account with an IAM user set up for programatic access.**
I started with a user with admin access (dont tell anyone) and then trimmed the access down once I determined which AWS services were being used. Seriously though, not having to fight with IAM as well as domains, certificates, cloudformation, s3, api gateway, lambda etc helped to keep me sane(ish)

**Node, NVM....**
It goes without saying that we'll need Node, NVM always helps, git, editor and all of the other things.


## Getting Started
Make sure that you have serverless installed. I've installed it globally here so you may need to `sudo` if you're on a mac or linux

    $ npm i -g serverless

As serverless is a wrapper, in this instance, around AWS we'll have to give it IAM credentials. Save the key and secret when you create the IAM user, because you'll need them! Hide them somewhere safe.
Set up serverless to connect to AWS using your IAM user.
```
$ serverless config credentials \ 
    --provider aws \ 
    --key xxxxxxxxxxxxxx \ 
    --secret xxxxxxxxxxxxxx
```
Next up is creating the serverless service. We'll specify that we are using Node and pass in the path where the service (and project) will live. 
```
serverless create --template aws-nodejs --path serverless-shopify-app
```
Move in to the new serverless-shopify-app folder
```
$ cd serverless-shopify-app
```
and initialise it for npm
```
npm init -y
```
Now we have the ```packages.json``` file we can add some packages.
```
$ npm i --save \
    axios \
    koa \
    koa-session \
    @shopify/koa-shopify-auth \
    dotenv \
    isomorphic-fetch \
    next \
    react \
    react-dom \
    path-match \
    url \
    serverless-http \
    serverless-apigw-binary \
    serverless-domain-manager
```

While we are in the ```packages.json``` file add the following scripts. We'll use these later.
```
  "scripts": {
	"dev": "next",
	"build": "next build",
    "deploy": "next build && sls deploy"
  },
```

The ```serverless.yml``` is created with a bunch of example code. I deleted it and replaced it with this.
```
service: serverless-shopify-app

provider:
  name: aws
  runtime: nodejs12.x
  stage: ${self:custom.config.NODE_ENV}
  region: eu-west-2

functions:
  index:
    handler: handler.index
    events:
      - http: ANY /
      - http: ANY /{proxy+}

plugins:
  - serverless-apigw-binary
  - serverless-domain-manager

custom:
  secrets: ${file(config.json)}
  apigwBinary:
    types:
      - '*/*'
  customDomain:
    domainName: ${self:custom.config.DOMAIN}
    basePath: ''
    stage: ${self:custom.config.NODE_ENV}
    createRoute53Record: true 
```

Add a new file ```config.json``` for our environment and domain settings
```
{
	"NODE_ENV": "production",
	"DOMAIN": "ssa.uark.uk"
}
```
## A Super Simple Next App

Next create ```pages/index.js```
```
const Index = () => (
	<div>
	  <p>Serverless Shopify App</p>
	</div>
  );
  
  export default Index;
```

Try building the next js app and check localhost:3000 in your browser
```
$ npm run dev

> serverless-shopify-app@1.0.0 dev /Users/john/Code/serverless-shopify-app
> next

ready - started server on http://localhost:3000
```

## The Shopify App

- Log in to partner account
- In Apps create a new app and choose ***Custom App***
- Add your name & url details
- Add <your-url>/auth/callback to the allow urls field
- Add shopify keys to ```.env``` file
```	
SHOPIFY_API_KEY='xxxxxxxxxxxxxxxx'
SHOPIFY_API_SECRET_KEY='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

## Use serverless to deploy to aws
```$ npm run deploy```

When you first build and deploy your aws stack the subdomain that you are using may not exist. Run 
```
$ sls create_domain
```

AWS Stuff
- Need a domain in Route53


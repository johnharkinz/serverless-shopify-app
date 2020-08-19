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

AWS Stuff
- Need a domain in Route53


# Files

StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Create files and folders

The file explorer is accessible using the button in left corner of the navigation bar. You can create a new file by clicking the **New file** button in the file explorer. You can also create folders by clicking the **New folder** button.

## Switch to another file

All your files and folders are presented as a tree in the file explorer. You can switch from one to another by clicking a file in the tree.

## Rename a file

You can rename the current file by clicking the file name in the navigation bar or by clicking the **Rename** button in the file explorer.

## Delete a file

You can delete the current file by clicking the **Remove** button in the file explorer. The file will be moved into the **Trash** folder and automatically deleted after 7 days of inactivity.

## Export a file

You can export the current file by clicking **Export to disk** in the menu. You can choose to export the file as plain Markdown, as HTML using a Handlebars template or as a PDF.


# Synchronization

Synchronization is one of the biggest features of StackEdit. It enables you to synchronize any file in your workspace with other files stored in your **Google Drive**, your **Dropbox** and your **GitHub** accounts. This allows you to keep writing on other devices, collaborate with people you share the file with, integrate easily into your workflow... The synchronization mechanism takes place every minute in the background, downloading, merging, and uploading file modifications.

There are two types of synchronization and they can complement each other:

- The workspace synchronization will sync all your files, folders and settings automatically. This will allow you to fetch your workspace on any other device.
	> To start syncing your workspace, just sign in with Google in the menu.

- The file synchronization will keep one file of the workspace synced with one or multiple files in **Google Drive**, **Dropbox** or **GitHub**.
	> Before starting to sync files, you must link an account in the **Synchronize** sub-menu.

## Open a file

You can open a file from **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Open from**. Once opened in the workspace, any modification in the file will be automatically synced.

## Save a file

You can save any file of the workspace to **Google Drive**, **Dropbox** or **GitHub** by opening the **Synchronize** sub-menu and clicking **Save on**. Even if a file in the workspace is already synced, you can save it to another location. StackEdit can sync one file with multiple locations and accounts.

## Synchronize a file

Once your file is linked to a synchronized location, StackEdit will periodically synchronize it by downloading/uploading any modification. A merge will be performed if necessary and conflicts will be resolved.

If you just have modified your file and you want to force syncing, click the **Synchronize now** button in the navigation bar.

> **Note:** The **Synchronize now** button is disabled if you have no file to synchronize.

## Manage file synchronization

Since one file can be synced with multiple locations, you can list and manage synchronized locations by clicking **File synchronization** in the **Synchronize** sub-menu. This allows you to list and remove synchronized locations that are linked to your file.


# Publication

Publishing in StackEdit makes it simple for you to publish online your files. Once you're happy with a file, you can publish it to different hosting platforms like **Blogger**, **Dropbox**, **Gist**, **GitHub**, **Google Drive**, **WordPress** and **Zendesk**. With [Handlebars templates](http://handlebarsjs.com/), you have full control over what you export.

> Before starting to publish, you must link an account in the **Publish** sub-menu.

## Publish a File

You can publish your file by opening the **Publish** sub-menu and by clicking **Publish to**. For some locations, you can choose between the following formats:

- Markdown: publish the Markdown text on a website that can interpret it (**GitHub** for instance),
- HTML: publish the file converted to HTML via a Handlebars template (on a blog for example).

## Update a publication

After publishing, StackEdit keeps your file linked to that publication which makes it easy for you to re-publish it. Once you have modified your file and you want to update your publication, click on the **Publish now** button in the navigation bar.

> **Note:** The **Publish now** button is disabled if your file has not been published yet.

## Manage file publication

Since one file can be published to multiple locations, you can list and manage publish locations by clicking **File publication** in the **Publish** sub-menu. This allows you to list and remove publication locations that are linked to your file.


# Markdown extensions

StackEdit extends the standard Markdown syntax by adding extra **Markdown extensions**, providing you with some nice features.

> **ProTip:** You can disable any **Markdown extension** in the **File properties** dialog.


## SmartyPants

SmartyPants converts ASCII punctuation characters into "smart" typographic punctuation HTML entities. For example:

|                |ASCII                          |HTML                         |
|----------------|-------------------------------|-----------------------------|
|Single backticks|`'Isn't this fun?'`            |'Isn't this fun?'            |
|Quotes          |`"Isn't this fun?"`            |"Isn't this fun?"            |
|Dashes          |`-- is en-dash, --- is em-dash`|-- is en-dash, --- is em-dash|


## KaTeX

You can render LaTeX mathematical expressions using [KaTeX](https://khan.github.io/KaTeX/):

The *Gamma function* satisfying $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$ is via the Euler integral

$$
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
$$

> You can find more information about **LaTeX** mathematical expressions [here](http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference).


## UML diagrams

You can render UML diagrams using [Mermaid](https://mermaidjs.github.io/). For example, this will produce a sequence diagram:

```mermaid
sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
Bob-x John: I am good thanks!
Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

Bob-->Alice: Checking with John...
Alice->John: Yes... John, how are you?
```

And this will produce a flow chart:

```mermaid
graph LR
A[Square Rect] -- Link text --> B((Circle))
A --> C(Round Rect)
B --> D{Rhombus}
C --> D
```


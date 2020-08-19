require('isomorphic-fetch');
const Koa = require('koa');
//const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

dotenv.config();

//const port = parseInt(process.env.PORT, 10) || 3000;
//const dev = process.env.NODE_ENV !== 'production';
//const app = next({ dev });
//const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

const koa = module.exports = new Koa();
koa.use(session({ sameSite: 'none', secure: true }, koa));
koa.keys = [SHOPIFY_API_SECRET_KEY];

koa.use(
	createShopifyAuth({
		apiKey: SHOPIFY_API_KEY,
		secret: SHOPIFY_API_SECRET_KEY,
		scopes: ['read_products'],
		afterAuth(ctx) {
		const { shop, accessToken } = ctx.session;

		ctx.redirect('/Readme.md');
		},
	}),
);

koa.use(verifyRequest());
koa.use(async (ctx) => {
	await handle(ctx.req, ctx.res);
	ctx.respond = false;
	ctx.res.statusCode = 200;
	}
);
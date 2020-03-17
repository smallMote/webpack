const Koa = require('koa');
const koaBodyparser = require('koa-bodyparser');
const KoaRouter = require('koa-router')();
const app = new Koa();
app.use(koaBodyparser());
app.use(KoaRouter.routes());

KoaRouter.get('/api/list', (ctx, next) => {
  ctx.response.body = JSON.stringify({
    count: 100,
    list: [
      {
        firstname: 'Larry',
        lastname: 'Smith'
      }
    ]
  })
  console.log(ctx.body)
})
app.listen(10086, () => {
  console.log('服务器已启动！\nhttp:localhost:10086');
})
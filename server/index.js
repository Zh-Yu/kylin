const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const mysql = require('mysql');

const secret = require('./secret');

const app = new Koa();
const router = new Router();

const connection = mysql.createConnection(secret.database);
connection.connect();

const databaseQuery = function(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results, fields) => {
      if(error) reject(error)
      else resolve(results, fields);
    })
  })
}

router.get('/bizType', async (ctx, next) => {
  const allBizType = await databaseQuery('SELECT * From bizType');
  ctx.body = allBizType;
});

router.get('/existEmployee', async (ctx, next) => {
  const { chineseName } = ctx.request.query;
  const employeeId = await databaseQuery('SELECT id From employees Where chineseName=?', [chineseName]);
  ctx.body = { exist: employeeId.length > 0 };
})

router.get('/getEmployeePerformance', async (ctx, next) => {
  const { chineseName } = ctx.request.query;
  const result = await databaseQuery(`
    Select performance.*, employees.id as employeesId From performance
    Right Join employees On performance.employeeId = employees.id
    AND employees.chineseName = ?`, [chineseName]);
  ctx.body = result;
})

router.post('/updateEmployeePerformance', async (ctx, next) => {
  const { employeeId, updatePerformanceList} = ctx.request.body;
  await Promise.all(updatePerformanceList.map(item => databaseQuery(`
    Insert Into performance(employeeId, bizTypeId, value)
    Values (?, ?, ?)
    ON DUPLICATE KEY UPDATE value = ?
  `, [employeeId, item.bizTypeId, item.value, item.value])));
  ctx.body = { code: 0};
})

process.on('exit', () => {
  connection.end();
})

app.use(cors()).use(logger()).use(bodyParser()).use(router.routes()).use(router.allowedMethods());
app.listen(3000);
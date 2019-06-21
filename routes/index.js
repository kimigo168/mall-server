const users = require('./users')
const goods = require('./goods')

module.exports = (app) => {

  // app.use('/', index);
  app.use('/users', users);
  app.use('/goods', goods);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    // res.render('error')
    console.log('err', err)
    res.json({status: '1', msg: '', result: ''})
  })
}
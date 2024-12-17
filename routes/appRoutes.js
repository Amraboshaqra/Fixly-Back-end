const authRoute = require('./authRoute')
const productRoute = require('./productRoutes')
const serviceRoute = require('./serviceRoutes')


const mountRoutes = (app) => {
    app.use('/fixly/api/auth', authRoute)
    app.use('/fixly/api/product', productRoute)    
    app.use('/fixly/api/service', serviceRoute)    

}
module.exports = mountRoutes; 
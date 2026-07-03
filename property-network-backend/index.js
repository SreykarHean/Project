const app = require('./src/app')
const { sequelize } = require('./src/models')
require('dotenv').config()

const PORT = process.env.PORT || 5000

sequelize.authenticate()
  .then(() => {
    console.log('Database connected and synced')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
  })

const http = require('http')
const YAML = require('yamljs')
const config = YAML.load(process.cwd() + '/blog.conf')
if (config) {
  const { service_port } = config
  global.config = config
  const app = require('./app')
  app.set('port', service_port)
  server = http.createServer(app)
  server.listen(service_port, function() {
    console.log(
      `[${new Date().toISOString()}] SUCCESS App listening on port ${service_port}`
    )
  })
}

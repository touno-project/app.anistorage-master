const nx = require('nuxt')
const http = require('http')
const { spawn } = require('child_process')
const electron = require('electron')
const path = require('path')
const consola = require('consola')
const kill = require('tree-kill')

let proc = null
let server = null
let _NUXT_URL_ = null

const mainServer = () => {
  if (_NUXT_URL_) {
    if (proc) kill(proc.pid, 'SIGKILL')
    let createdServer = () => {
      console.log('electron starting...')
      proc = spawn(electron, ['--inspect=5858', path.join(__dirname, '../main.js'), _NUXT_URL_])

      proc.stdout.on('data', (data) => {
        if (data.toString()) console.log(data.toString())
      })
      proc.stderr.on('data', (data) => {
        if (data.toString()) consola.error(data.toString())
      })

      proc.on('close', () => {
        createdServer()
      })
    }
    createdServer()
  }
}

const renderServer = async () => {
  // Import and Set Nuxt.js options
  let config = require('./../nuxt.config.js')
  config.dev = !((process.env.NODE_ENV || 'production') === 'production')
  config.rootDir = `${__dirname}/../` // for electron-packager

  // Init Nuxt.js
  const nuxt = new nx.Nuxt(config)
  const builder = new nx.Builder(nuxt)
  server = http.createServer(nuxt.render)

  // Build only in dev mode
  await builder.build()

  // Listen the serverasdasd
  await server.listen()
}

(async () => {
  await renderServer()
  
  _NUXT_URL_ = `http://localhost:${server.address().port}`
  consola.start(`Electron Compile, Nuxt on ${_NUXT_URL_}`)
  await mainServer()
})().catch(consola.error)

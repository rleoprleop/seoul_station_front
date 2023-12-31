const { app, BrowserWindow } = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('path')


// modify your existing createWindow() function
function createWindow () {
  const win = new BrowserWindow({
    width: 1900,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('login.html')
}
app.whenReady().then(() => {
  createWindow()
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


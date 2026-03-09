import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    // fullscreen: true,
    useContentSize: true,
    width: 1000
  })

  mainWindow.maximize();

  mainWindow.loadURL(winURL)
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}


//Single Instance
var myWindow = null;

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (myWindow) {
    if (myWindow.isMinimized()) myWindow.restore();
    myWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    const { autoUpdater } = require('electron-updater')
    autoUpdater.on('update-downloaded', () => {
      autoUpdater.quitAndInstall()
    })
    autoUpdater.checkForUpdates()
  }
})

// ipcMain.on('update-control', (event, arg) => {
//   if (arg == 'checkForUpdates') {
//     if (process.env.NODE_ENV === 'production') {
//       event.sender.send('update-message', 'Checking for and installing updates')
//       autoUpdater.checkForUpdates()
//     }
//     else {
//       event.sender.send('update-message', 'You can not check for updates in developer mode')
//     }
//   }
  // if (arg == 'update') {
  //   updateCalled = true;
  //   if (downloaded) {
  //     autoUpdater.quitAndInstall();
  //   }
  // }
// })
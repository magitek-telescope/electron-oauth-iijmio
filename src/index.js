// @flow

import { stringify as q, parse } from 'querystring'
import { app, BrowserWindow } from 'electron'

export default class IIJAuth {
  clientId: number;
  window: any;

  constructor (clientId: number) {
    this.clientId = clientId
    this.window = null
  }

  startRequest (): Promise<any> {
    return new Promise((resolve, reject) => {
      app.on('ready', () => {
        this.window = new BrowserWindow({
          width: 800,
          height: 600,
          webPreferences: { nodeIntegration: false }
        })
        const params = q({
          client_id: this.clientId,
          response_type: 'token',
          redirect_uri: 'http://localhost',
          state: '1'
        })
        const authURL = `https://api.iijmio.jp/mobile/d/v1/authorization/?${params}`
        this.window.loadURL(authURL)
        this.window.show()
        this.window.webContents.on('will-navigate', (event, url) => {
          resolve(this.returnCredential(url))
        })
        this.window.webContents.on(
          'did-get-redirect-request',
          (event, oldUrl, newUrl) => {
            resolve(this.returnCredential(newUrl))
          }
        )
        this.window.on('close', () => (this.window = null), false)
      })
    })
  }

  returnCredential (url: string) {
    let result
    url = url.replace('localhost#', 'localhost?')
    this.window.destroy()

    try {
      result = parse(url)
    } catch (e) {}

    return result || false
  }
}

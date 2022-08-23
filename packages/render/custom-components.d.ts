import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    webview: any
  }
}

export {}

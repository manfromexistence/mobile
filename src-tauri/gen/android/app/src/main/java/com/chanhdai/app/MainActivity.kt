package com.chanhdai.app

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    window.decorView.post {
      configureWebView(findWebView(window.decorView))
    }
  }

  private fun findWebView(view: android.view.View): WebView? {
    if (view is WebView) return view
    if (view is android.view.ViewGroup) {
      for (i in 0 until view.childCount) {
        findWebView(view.getChildAt(i))?.let { return it }
      }
    }
    return null
  }

  private fun configureWebView(webView: WebView?) {
    webView?.settings?.apply {
      cacheMode = WebSettings.LOAD_DEFAULT
      domStorageEnabled = true
      databaseEnabled = true
      loadWithOverviewMode = true
      useWideViewPort = true
      builtInZoomControls = false
      displayZoomControls = false
      mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
    }
  }
}

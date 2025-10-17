package com.chuchi.loveapp

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var sharedPrefs: SharedPreferences
    private var isSessionAuthenticated = false  // Session-based authentication
    private var appInBackground = false  // Track if app went to background
    
    // Your live Vercel URL - this will handle authentication UI
    // Add timestamp to prevent caching and force fresh load
    private fun getWebsiteUrl(): String {
        return "https://chuchii.vercel.app?t=${System.currentTimeMillis()}&android=1"
    }
    
    // Set your password here - case insensitive (for Android-side validation if needed)
    private val correctPassword = "supernova"  // Password (case insensitive)
    
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Initialize SharedPreferences for session management
        sharedPrefs = getSharedPreferences("ChuchiApp", Context.MODE_PRIVATE)
        
        // Initialize views
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        webView = findViewById(R.id.webView)
        
        // Clear any existing WebView data to ensure fresh session
        clearWebViewData()
        
        setupWebView()
        setupSwipeRefresh()
        
        // Always start with authentication (no persistent login)
        showAuthenticationWebView()
    }
    
    private fun clearWebViewData() {
        // Clear all WebView data to ensure we start fresh
        WebStorage.getInstance().deleteAllData()
        
        // Clear cookies
        val cookieManager = CookieManager.getInstance()
        cookieManager.removeAllCookies(null)
        cookieManager.flush()
        
        // Clear cache
        webView.clearCache(true)
        webView.clearHistory()
        webView.clearFormData()
    }
    
    private fun isAuthenticated(): Boolean {
        return isSessionAuthenticated  // Only check session, not persistent storage
    }
    
    private fun showAuthenticationWebView() {
        // Load website - it will show password screen since user is not authenticated
        isSessionAuthenticated = false
        
        // Clear any existing authentication state
        clearWebViewData()
        
        webView.loadUrl(getWebsiteUrl())
        swipeRefreshLayout.visibility = View.VISIBLE
    }
    
    private fun showWebView() {
        swipeRefreshLayout.visibility = View.VISIBLE
        // Load your love app - user is authenticated
        if (!isSessionAuthenticated) {
            isSessionAuthenticated = true
        }
        webView.loadUrl(getWebsiteUrl())
    }
    
    private fun setupWebView() {
        webView.apply {
            settings.apply {
                // Enable JavaScript for your Next.js app
                javaScriptEnabled = true
                
                // Enable DOM storage for modern web apps
                domStorageEnabled = true
                
                // Enable local storage
                databaseEnabled = true
                
                // Support for viewport meta tag
                useWideViewPort = true
                loadWithOverviewMode = true
                
                // Enable zoom controls but hide zoom buttons
                builtInZoomControls = true
                displayZoomControls = false
                
                // Support for media playback
                mediaPlaybackRequiresUserGesture = false
                
                // Allow mixed content (HTTP/HTTPS)
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                
                // Cache settings - use no cache for fresh session every time
                cacheMode = WebSettings.LOAD_NO_CACHE
                
                // User agent (optional: identify as mobile)
                userAgentString = settings.userAgentString + " ChuchiLoveApp/1.0"
                
                // Disable form data and password saving
                saveFormData = false
                savePassword = false
            }
            
            // Set WebView client to handle page navigation and authentication
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    // Keep navigation within the WebView
                    return false
                }
                
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    swipeRefreshLayout.isRefreshing = false
                    
                    // Force React authentication to reset by triggering window blur/hidden events
                    webView.evaluateJavascript("""
                        (function() {
                            // Clear any possible storage first
                            if (typeof localStorage !== 'undefined') localStorage.clear();
                            if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
                            
                            // Force React auth component to logout by simulating tab hidden
                            if (typeof document !== 'undefined') {
                                // Set document.hidden to true to trigger visibility change
                                Object.defineProperty(document, 'hidden', {
                                    get: function() { return true; },
                                    configurable: true
                                });
                                
                                // Dispatch visibility change event
                                document.dispatchEvent(new Event('visibilitychange'));
                                
                                // Also dispatch blur event on window
                                window.dispatchEvent(new Event('blur'));
                                
                                // Reset document.hidden after a moment
                                setTimeout(() => {
                                    Object.defineProperty(document, 'hidden', {
                                        get: function() { return false; },
                                        configurable: true
                                    });
                                    document.dispatchEvent(new Event('visibilitychange'));
                                    window.dispatchEvent(new Event('focus'));
                                }, 100);
                            }
                            
                            return 'reset_auth';
                        })();
                    """) { _ ->
                        // Wait a bit then check if password screen is shown
                        webView.postDelayed({
                            webView.evaluateJavascript("""
                                (function() {
                                    const passwordScreen = document.querySelector('[class*="password"]') || 
                                                         document.querySelector('[placeholder*="secret"]') ||
                                                         document.querySelector('input[type="password"]');
                                    const isPasswordVisible = passwordScreen && passwordScreen.offsetParent !== null;
                                    
                                    // If still no password screen, reload the page
                                    if (!isPasswordVisible) {
                                        window.location.reload();
                                    }
                                    
                                    return isPasswordVisible;
                                })();
                            """) { result ->
                                isSessionAuthenticated = false
                            }
                        }, 1000)
                    }
                }
                
                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    super.onReceivedError(view, request, error)
                    swipeRefreshLayout.isRefreshing = false
                    val errorMessage = "Error: ${error?.description} (Code: ${error?.errorCode})"
                    Toast.makeText(this@MainActivity, errorMessage, Toast.LENGTH_LONG).show()
                    
                    // If main website fails, show error page
                    if (request?.url.toString().contains("chuchii.vercel.app")) {
                        webView.loadUrl("file:///android_asset/error.html")
                    }
                }
                
                override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    swipeRefreshLayout.isRefreshing = true
                    
                    // Inject script to clear storage as soon as possible
                    if (url?.contains("chuchii.vercel.app") == true) {
                        webView.evaluateJavascript("""
                            // Clear all possible authentication storage immediately
                            if (typeof localStorage !== 'undefined') localStorage.clear();
                            if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
                            
                            // Clear IndexedDB if used
                            if ('indexedDB' in window) {
                                try {
                                    indexedDB.databases().then(databases => {
                                        databases.forEach(db => {
                                            if (db.name) indexedDB.deleteDatabase(db.name);
                                        });
                                    }).catch(() => {});
                                } catch(e) {}
                            }
                        """) { _ -> }
                    }
                }
            }
            
            // Set Chrome client for console logs and other features
            webChromeClient = object : WebChromeClient() {
                override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                    // Optional: Log console messages for debugging
                    return true
                }
                
                override fun onPermissionRequest(request: PermissionRequest?) {
                    // Handle media permissions if needed
                    request?.grant(request.resources)
                }
            }
        }
    }
    
    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener {
            webView.reload()
        }
        
        // Customize colors to match your app theme
        swipeRefreshLayout.setColorSchemeResources(
            android.R.color.holo_red_light,
            android.R.color.holo_blue_light,
            android.R.color.holo_green_light,
            android.R.color.holo_orange_light
        )
    }
    
    // Handle back button
    override fun onBackPressed() {
        when {
            webView.canGoBack() -> {
                webView.goBack()
            }
            else -> {
                super.onBackPressed()
            }
        }
    }
    
    override fun onPause() {
        super.onPause()
        webView.onPause()
        // Mark app as going to background
        appInBackground = true
    }
    
    override fun onResume() {
        super.onResume()
        webView.onResume()
        
        // If app was in background and user was authenticated, require re-authentication
        if (appInBackground && isSessionAuthenticated) {
            isSessionAuthenticated = false  // Reset authentication
            clearWebViewData()  // Clear all web data
            // Reload the page to show password screen again
            webView.loadUrl(getWebsiteUrl())
        }
        appInBackground = false
    }
    
    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}
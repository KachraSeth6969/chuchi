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
    private var userInitiatedExit = false  // Track if user explicitly chose to exit
    private var hasInitiallyLoaded = false  // Track if we've done initial setup
    
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
        
        // Only clear data on very first load, not on navigation
        if (!hasInitiallyLoaded) {
            clearWebViewData()
            hasInitiallyLoaded = true
        }
        
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
                    
                    // Simple authentication tracking - don't interfere with web navigation
                    webView.evaluateJavascript("""
                        (function() {
                            // Just check if password screen is currently visible
                            const passwordScreen = document.querySelector('[class*="password"]') || 
                                                 document.querySelector('[placeholder*="secret"]') ||
                                                 document.querySelector('input[type="password"]');
                            const isPasswordVisible = passwordScreen && passwordScreen.offsetParent !== null;
                            return isPasswordVisible ? 'password_screen' : 'authenticated_screen';
                        })();
                    """) { result ->
                        val showingPasswordScreen = result.trim('"') == "password_screen"
                        
                        // Update our local authentication state to match what the web shows
                        if (showingPasswordScreen && isSessionAuthenticated) {
                            // Web is showing password screen, update our state
                            isSessionAuthenticated = false
                        } else if (!showingPasswordScreen && !isSessionAuthenticated) {
                            // Web is showing authenticated content, update our state
                            isSessionAuthenticated = true
                        }
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
                // Instead of closing app, ask user if they want to exit
                // This prevents accidental logout from back button
                showExitConfirmation()
            }
        }
    }
    
    private fun showExitConfirmation() {
        val builder = androidx.appcompat.app.AlertDialog.Builder(this)
        builder.setTitle("Exit Chuchi?")
        builder.setMessage("Are you sure you want to close the app? You'll need to enter the password again.")
        builder.setPositiveButton("Exit") { _, _ ->
            // User confirmed exit - mark as user-initiated and close the app
            userInitiatedExit = true
            finishAffinity()
        }
        builder.setNegativeButton("Stay") { dialog, _ ->
            // User wants to stay - just dismiss dialog
            dialog.dismiss()
        }
        builder.show()
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
        
        // Only force logout if app was truly in background for security
        // Let the web app handle its own navigation and authentication
        if (appInBackground && isSessionAuthenticated) {
            // Simply trigger the web app's visibility change to let it handle logout
            webView.evaluateJavascript("""
                // Let the web app's own visibility logic handle this
                if (typeof document !== 'undefined') {
                    document.dispatchEvent(new Event('visibilitychange'));
                    window.dispatchEvent(new Event('focus'));
                }
            """) { _ -> }
        }
        
        appInBackground = false
        userInitiatedExit = false
    }
    
    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}
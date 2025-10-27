package com.chuchi.loveapp

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.*
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var sharedPrefs: SharedPreferences
    private lateinit var connectivityManager: ConnectivityManager
    private var networkCallback: ConnectivityManager.NetworkCallback? = null
    private var isSessionAuthenticated = false  // Session-based authentication
    private var appInBackground = false  // Track if app went to background
    private var userInitiatedExit = false  // Track if user explicitly chose to exit
    private var hasInitiallyLoaded = false  // Track if we've done initial setup
    private var isNetworkAvailable = true  // Track network status
    
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
        
        // Initialize connectivity manager
        connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        
        // Initialize views
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        webView = findViewById(R.id.webView)
        
        // Setup network monitoring
        setupNetworkMonitoring()
        
        // Check initial network state
        checkNetworkConnectivity()
        
        // Clear any existing WebView data to ensure fresh session
        clearWebViewData()
        
        setupWebView()
        setupSwipeRefresh()
        
        // Always start with authentication (no persistent login)
        if (isNetworkAvailable) {
            showAuthenticationWebView()
        } else {
            showNoConnectionMessage()
        }
    }
    
    private fun setupNetworkMonitoring() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            networkCallback = object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    super.onAvailable(network)
                    runOnUiThread {
                        isNetworkAvailable = true
                        if (hasInitiallyLoaded) {
                            // Network came back, reload if needed
                            webView.reload()
                        } else {
                            // First time network available
                            showAuthenticationWebView()
                        }
                    }
                }

                override fun onLost(network: Network) {
                    super.onLost(network)
                    runOnUiThread {
                        isNetworkAvailable = false
                        showNoConnectionMessage()
                    }
                }
                
                override fun onCapabilitiesChanged(network: Network, networkCapabilities: NetworkCapabilities) {
                    super.onCapabilitiesChanged(network, networkCapabilities)
                    val hasInternet = networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                                     networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
                    
                    runOnUiThread {
                        isNetworkAvailable = hasInternet
                        if (!hasInternet) {
                            showNoConnectionMessage()
                        }
                    }
                }
            }

            val networkRequest = NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                .addCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
                .build()

            connectivityManager.registerNetworkCallback(networkRequest, networkCallback!!)
        }
    }

    private fun checkNetworkConnectivity(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val network = connectivityManager.activeNetwork
            val networkCapabilities = connectivityManager.getNetworkCapabilities(network)
            networkCapabilities?.let {
                val hasInternet = it.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                                 it.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
                isNetworkAvailable = hasInternet
                hasInternet
            } ?: false.also { isNetworkAvailable = false }
        } else {
            @Suppress("DEPRECATION")
            val networkInfo = connectivityManager.activeNetworkInfo
            val connected = networkInfo?.isConnected == true
            isNetworkAvailable = connected
            connected
        }
    }

    private fun showNoConnectionMessage() {
        val htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0; 
                        padding: 20px; 
                        background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    }
                    .container {
                        background: white;
                        padding: 40px 20px;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        max-width: 400px;
                    }
                    .emoji { font-size: 48px; margin-bottom: 20px; }
                    h1 { color: #1f2937; margin: 0 0 10px 0; font-size: 24px; font-weight: 600; }
                    p { color: #6b7280; margin: 10px 0; line-height: 1.5; }
                    .retry-btn {
                        background: #d8bff8;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        color: #1f2937;
                        font-weight: 500;
                        font-size: 16px;
                        margin-top: 20px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .retry-btn:hover { background: #c4a9f5; }
                    .tips {
                        background: #f9fafb;
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 20px;
                        text-align: left;
                    }
                    .tips h3 { color: #374151; margin: 0 0 10px 0; font-size: 16px; }
                    .tips ul { margin: 0; padding-left: 20px; }
                    .tips li { color: #6b7280; margin: 5px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="emoji">📱💔</div>
                    <h1>No Internet Connection</h1>
                    <p>Can't reach Chuchi's world right now. Check your connection and try again.</p>
                    
                    <button class="retry-btn" onclick="window.location.reload()">
                        Try Again
                    </button>
                    
                    <div class="tips">
                        <h3>💡 Quick Fixes:</h3>
                        <ul>
                            <li>Check if mobile data is enabled</li>
                            <li>Try switching to WiFi</li>
                            <li>Make sure you have good signal strength</li>
                            <li>Restart the app if needed</li>
                        </ul>
                    </div>
                </div>
            </body>
            </html>
        """.trimIndent()
        
        webView.loadDataWithBaseURL(null, htmlContent, "text/html", "UTF-8", null)
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
                
                // Cache settings - more aggressive for mobile data
                cacheMode = if (isNetworkAvailable) {
                    WebSettings.LOAD_DEFAULT
                } else {
                    WebSettings.LOAD_CACHE_ELSE_NETWORK
                }
                
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
                    
                    // Check if this is a network connectivity issue
                    val isMainPageError = request?.url.toString().contains("chuchii.vercel.app")
                    val isNetworkError = error?.errorCode in listOf(
                        WebViewClient.ERROR_HOST_LOOKUP,
                        WebViewClient.ERROR_CONNECT,
                        WebViewClient.ERROR_TIMEOUT,
                        -2, // ERROR_UNKNOWN_HOST value
                        WebViewClient.ERROR_IO
                    )
                    
                    if (isMainPageError && isNetworkError) {
                        // Network issue with main site - check connectivity and show appropriate message
                        if (!checkNetworkConnectivity()) {
                            showNoConnectionMessage()
                        } else {
                            // Network available but site unreachable - retry logic
                            Handler(Looper.getMainLooper()).postDelayed({
                                if (isNetworkAvailable) {
                                    webView.reload()
                                }
                            }, 3000) // Retry after 3 seconds
                            
                            Toast.makeText(this@MainActivity, 
                                "Connection issue. Retrying in 3 seconds...", 
                                Toast.LENGTH_SHORT).show()
                        }
                    } else if (isMainPageError) {
                        // Other error with main site
                        val errorMessage = "Site error: ${error?.description}"
                        Toast.makeText(this@MainActivity, errorMessage, Toast.LENGTH_LONG).show()
                    }
                    // For non-main page errors (like images, scripts), fail silently
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
            if (checkNetworkConnectivity()) {
                webView.reload()
            } else {
                showNoConnectionMessage()
                swipeRefreshLayout.isRefreshing = false
            }
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
        
        // Unregister network callback to prevent memory leaks
        networkCallback?.let { callback ->
            try {
                connectivityManager.unregisterNetworkCallback(callback)
            } catch (e: Exception) {
                // Callback was already unregistered or never registered
            }
        }
        
        webView.destroy()
    }
}
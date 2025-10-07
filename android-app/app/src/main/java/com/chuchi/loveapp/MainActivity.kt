package com.chuchi.loveapp

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.webkit.*
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var authContainer: ScrollView
    private lateinit var passwordInput: EditText
    private lateinit var submitButton: Button
    private lateinit var errorText: TextView
    private lateinit var sharedPrefs: SharedPreferences
    private var isSessionAuthenticated = false  // Session-based authentication
    private var appInBackground = false  // Track if app went to background
    
    // Your live Vercel URL
    private val websiteUrl = "https://chuchii.vercel.app"
    
    // Set your password here - case insensitive
    private val correctPassword = "supernova"  // Password (case insensitive)
    
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Initialize SharedPreferences for remembering login
        sharedPrefs = getSharedPreferences("ChuchiApp", Context.MODE_PRIVATE)
        
        // Initialize views
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        webView = findViewById(R.id.webView)
        authContainer = findViewById(R.id.authContainer)
        passwordInput = findViewById(R.id.passwordInput)
        submitButton = findViewById(R.id.submitButton)
        errorText = findViewById(R.id.errorText)
        
        setupWebView()
        setupSwipeRefresh()
        setupAuthentication()
        
        // Always show auth screen on fresh app launch (no persistent login)
        showAuthScreen()
    }
    
    private fun setupAuthentication() {
        submitButton.setOnClickListener {
            val enteredPassword = passwordInput.text.toString()
            
            // Check if entered password matches (case insensitive)
            if (enteredPassword.lowercase() == correctPassword.lowercase()) {
                // Hide keyboard first
                hideKeyboard()
                // Set session authentication (not persistent)
                isSessionAuthenticated = true
                showWebView()
            } else {
                // Show error and clear input
                errorText.text = "Try again ✨"
                errorText.visibility = View.VISIBLE
                passwordInput.text.clear()
                
                // Shake animation effect
                passwordInput.animate().translationX(25f).setDuration(100)
                    .withEndAction {
                        passwordInput.animate().translationX(-25f).setDuration(100)
                            .withEndAction {
                                passwordInput.animate().translationX(0f).setDuration(100)
                            }
                    }
            }
        }
        
        // Allow Enter key to submit
        passwordInput.setOnEditorActionListener { _, _, _ ->
            submitButton.performClick()
            true
        }
    }
    
    private fun isAuthenticated(): Boolean {
        return isSessionAuthenticated  // Only check session, not persistent storage
    }
    
    private fun showAuthScreen() {
        authContainer.visibility = View.VISIBLE
        swipeRefreshLayout.visibility = View.GONE
        errorText.visibility = View.GONE
        passwordInput.text.clear()  // Always clear password field
        passwordInput.requestFocus()
    }
    
    private fun showWebView() {
        authContainer.visibility = View.GONE
        swipeRefreshLayout.visibility = View.VISIBLE
        
        // Load your love app
        webView.loadUrl(websiteUrl)
    }
    
    private fun hideKeyboard() {
        val inputMethodManager = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        // Hide keyboard from current focused view (passwordInput)
        inputMethodManager.hideSoftInputFromWindow(passwordInput.windowToken, 0)
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
                
                // Cache settings for better performance
                cacheMode = WebSettings.LOAD_DEFAULT
                
                // User agent (optional: identify as mobile)
                userAgentString = settings.userAgentString + " ChuchiLoveApp/1.0"
            }
            
            // Set WebView client to handle page navigation
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    // Keep navigation within the WebView
                    return false
                }
                
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    swipeRefreshLayout.isRefreshing = false
                }
                
                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                    super.onReceivedError(view, request, error)
                    swipeRefreshLayout.isRefreshing = false
                    Toast.makeText(this@MainActivity, "Error loading page", Toast.LENGTH_SHORT).show()
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
            authContainer.visibility == View.VISIBLE -> {
                // If on auth screen, exit app
                super.onBackPressed()
            }
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
        
        // If app was in background and user is authenticated, require re-authentication
        if (appInBackground && isSessionAuthenticated) {
            isSessionAuthenticated = false  // Reset authentication
            passwordInput.text.clear()  // Clear the password field
            errorText.visibility = View.GONE  // Hide any error messages
            showAuthScreen()  // Show password screen again
        }
        appInBackground = false
    }
    
    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}
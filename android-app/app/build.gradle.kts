plugins {
  alias(libs.plugins.android.application)
}

android {
    namespace = "com.mentalmap.app"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.mentalmap.app"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    packaging {
      resources {
        excludes += "/META-INF/{AL2.0,LGPL2.1}"
      }
    }
}

kotlin {
    jvmToolchain(17)
}

dependencies {
  implementation(libs.androidx.core.ktx)
  implementation("androidx.appcompat:appcompat:1.6.1")
  // Trusted Web Activity: renders the real Chrome origin (not an embedded
  // WebView), which is required for Google Sign-In to work at all — Google
  // blocks its OAuth flow inside plain WebViews.
  implementation("androidx.browser:browser:1.8.0")
  implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.5.0")
}

package com.mysakhi

import android.content.Intent
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*

class AutoCallModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "AutoCall"
    }

    @ReactMethod
    fun makeCall(number: String, promise: Promise) {
        try {
            val formattedNumber = if (!number.startsWith("tel:")) "tel:$number" else number
            val intent = Intent(Intent.ACTION_CALL)
            intent.data = Uri.parse(formattedNumber)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
            promise.resolve("Call initiated")
        } catch (e: Exception) {
            Log.e("AutoCall", "Error making call", e)
            promise.reject("CALL_FAILED", e.message)
        }
    }
}

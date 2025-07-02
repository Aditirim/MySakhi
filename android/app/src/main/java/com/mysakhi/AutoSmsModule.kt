package com.mysakhi

import android.app.PendingIntent
import android.content.Intent
import android.telephony.SmsManager
import android.util.Log
import com.facebook.react.bridge.*

class AutoSmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val context = reactContext

    override fun getName(): String {
        return "AutoSMS"
    }

    @ReactMethod
    fun readLatestRideSms(promise: Promise) {
        try {
            val cr = context.contentResolver
            val inboxURI = android.provider.Telephony.Sms.Inbox.CONTENT_URI
            val reqCols = arrayOf("_id", "address", "body", "date")
            val cursor = cr.query(inboxURI, reqCols, null, null, "date DESC")

            cursor?.use {
                while (it.moveToNext()) {
                    val body = it.getString(it.getColumnIndexOrThrow("body")).lowercase()
                    if (body.contains("ola") || body.contains("uber") || body.contains("rapido")) {
                        val vehicleNumber = extractValue(body, "vehicle number[:\\-]?")
                        val driverName = extractValue(body, "driver name[:\\-]?")
                        val driverPhone = extractPhone(body)

                        val result = Arguments.createMap().apply {
                            putString("vehicleNumber", vehicleNumber ?: "Not Found")
                            putString("driverName", driverName ?: "Not Found")
                            putString("driverPhone", driverPhone ?: "Not Found")
                        }

                        promise.resolve(result)
                        return
                    }
                }
            }
            promise.reject("NO_SMS", "No recent ride SMS found")
        } catch (e: Exception) {
            Log.e("AutoSMS", "Error reading SMS", e)
            promise.reject("SMS_ERROR", e.message)
        }
    }

    private fun extractValue(body: String, key: String): String? {
        val pattern = Regex("$key\\s*([a-zA-Z0-9\\s\\-]+)")
        val match = pattern.find(body)
        return match?.groups?.get(1)?.value?.trim()
    }

    private fun extractPhone(body: String): String? {
        val pattern = Regex("(\\+91\\d{10}|\\d{10})")
        val match = pattern.find(body)
        return match?.groups?.get(1)?.value?.trim()
    }

 @ReactMethod
fun sendSMS(number: String, message: String, promise: Promise) {
    try {
        val smsManager = SmsManager.getDefault()
        val sentPI = PendingIntent.getBroadcast(
            context,
            0,
            Intent("SMS_SENT"),
            PendingIntent.FLAG_IMMUTABLE
        )
        smsManager.sendTextMessage(number, null, message, sentPI, null)
        promise.resolve("SMS sent successfully")
    } catch (e: Exception) {
        Log.e("AutoSMS", "Failed to send SMS", e)
        promise.reject("SEND_SMS_FAILED", e.message)
    }
}
}        

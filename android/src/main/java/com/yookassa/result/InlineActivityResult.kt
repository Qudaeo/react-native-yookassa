package com.yookassa.result

import android.app.Activity
import android.content.Intent
import com.yookassa.result.TransparentActivity.Companion.intentForResult
import java.lang.ref.Reference
import java.lang.ref.WeakReference

class InlineActivityResult(activity: Activity?) {
    private var activityReference: Reference<Activity?>? = null

    //region callbacks
    private val responseListeners: MutableList<ActivityResultListener> = ArrayList()

    //the listener we will give to the fragment
    private val listener: TransparentActivity.ActivityResultListener =
        object : TransparentActivity.ActivityResultListener {
            override fun onActivityResult(resultCode: Int, data: Intent?) {
                onReceivedActivityResult(resultCode, data)
            }
        }

    init {
        if (activity != null) {
            this.activityReference = WeakReference(activity)
        } else {
            this.activityReference = WeakReference(null)
        }
    }

    private fun onReceivedActivityResult(resultCode: Int, data: Intent?) {
        val result = Result(resultCode, data)
        if (resultCode == Activity.RESULT_OK) {
            for (listener in responseListeners) {
                listener.onSuccess(result)
            }
        } else {
            for (listener in responseListeners) {
                listener.onFailed(result)
            }
        }
    }

    fun startForResult(intent: Intent?, listener: ActivityResultListener?): InlineActivityResult {
        if (intent != null && listener != null) {
            responseListeners.add(listener)
            this.start(intent)
        }
        return this
    }

    private fun start(intent: Intent) {
        val activity = activityReference!!.get()
        if (activity == null || activity.isFinishing) {
            return
        }

        activity.runOnUiThread(Runnable {
            activity.startActivity(
                intentForResult(
                    activity,
                    intent,
                    listener
                )
            )
        })
    }

    companion object {
        private const val TAG = "ACTIVITY_RESULT_FRAGMENT_YOO_KASSA"

        //endregion
        fun startForResult(
            activity: Activity?,
            intent: Intent?,
            listener: ActivityResultListener?
        ): InlineActivityResult {
            return InlineActivityResult(activity).startForResult(intent, listener)
        }
    }
}

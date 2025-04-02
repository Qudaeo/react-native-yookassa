package com.yookassa.result

interface ActivityResultListener {
    fun onSuccess(result: Result)
    fun onFailed(result: Result)
}

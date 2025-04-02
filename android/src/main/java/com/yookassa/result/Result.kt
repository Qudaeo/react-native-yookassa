package com.yookassa.result

import android.content.Intent

@JvmRecord
data class Result(val resultCode: Int, val data: Intent?)

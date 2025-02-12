package group.lamantin.yandex.payment.result

interface ActivityResultListener {
    fun onSuccess(result: Result)
    fun onFailed(result: Result)
}

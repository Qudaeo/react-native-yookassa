package group.lamantin.yandex.payment.result

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class TransparentActivity: AppCompatActivity() {

  interface ActivityResultListener {
    fun onActivityResult(resultCode: Int, data: Intent?)
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val intent = getIntentForStart()
    resultLauncher.launch(intent)
  }

  private val resultLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
    listener!!.onActivityResult(result.resultCode, result.data)
    this.finish()
  }

  companion object {
    private var listener: ActivityResultListener? = null

    @JvmStatic
    fun intentForResult(context: Context, intent: Intent, listener: ActivityResultListener): Intent {
      TransparentActivity.listener = listener
      val selfIntent = Intent(context, TransparentActivity::class.java)
      val bundle = Bundle()
      bundle.putParcelable("TransparentActivity_INTENT", intent)
      selfIntent.putExtra("ARGS", bundle)
      return selfIntent
    }

    fun TransparentActivity.getIntentForStart(): Intent {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) // API 33
        @Suppress("DEPRECATION")
        return intent.getBundleExtra("ARGS")!!.getParcelable("TransparentActivity_INTENT")!!
      else
        return intent.getBundleExtra("ARGS")!!.getParcelable("TransparentActivity_INTENT", Intent::class.java)!!
    }
  }

}

package group.lamantin.yandex.payment.result;

import android.content.Intent;
import androidx.annotation.Nullable;

public record Result(int resultCode, @Nullable Intent data) { }

package group.lamantin.yandex.payment.result;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

/**
 * DO NOT USE THIS FRAGMENT DIRECTLY!
 * It's only here because fragments have to be public
 */
public class ActivityResultFragment extends Fragment {

    public static final String INTENT_TO_START = "INTENT_TO_START";

    private static final int REQUEST_CODE = 24;

    @Nullable
    private ActivityResultListener listener;

    @Nullable
    private Intent intentToStart;

    public ActivityResultFragment() {
        setRetainInstance(true);
    }

    public static ActivityResultFragment newInstance(@NonNull final Intent intent) {
        final Bundle args = new Bundle();
        args.putParcelable(INTENT_TO_START, intent);
        final ActivityResultFragment fragment = new ActivityResultFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final Bundle arguments = getArguments();
        if (arguments != null) {
            this.intentToStart = arguments.getParcelable(INTENT_TO_START);
            startActivityForResult(intentToStart, REQUEST_CODE);
        }
    }

//    @Override
//    public void onResume() {
//        super.onResume();
//        if (intentToStart != null) {
//            startActivityForResult(intentToStart, REQUEST_CODE);
//        } else {
//            // this shouldn't happen, but just to be sure
//            removeFragment();
//        }
//    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_CODE) {
            if (listener != null) {
                listener.onActivityResult(requestCode, resultCode, data);
            }
            removeFragment();
            intentToStart = null;
        }
    }

    public ActivityResultFragment setListener(@Nullable ActivityResultListener listener) {
        if (listener != null) {
            this.listener = listener;
        }
        return this;
    }

    private void removeFragment() {
        getFragmentManager().beginTransaction()
                .remove(this)
                .commitAllowingStateLoss();
    }

    interface ActivityResultListener {
        void onActivityResult(int requestCode, int resultCode, Intent data);
    }
}

package com.localconnect.app.booking;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.localconnect.app.databinding.ActivityBookingBinding;
import com.localconnect.app.utils.Constants;
import com.localconnect.app.utils.TokenManager;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;

public class BookingActivity extends AppCompatActivity {

    private ActivityBookingBinding binding;
    private BookingViewModel viewModel;
    private String workerId;
    private Calendar startCal = Calendar.getInstance();
    private Calendar endCal   = Calendar.getInstance();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityBookingBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        workerId = getIntent().getStringExtra(Constants.EXTRA_WORKER_ID);
        TokenManager tm = new TokenManager(this);
        viewModel = new ViewModelProvider(this).get(BookingViewModel.class);
        viewModel.init(tm);

        binding.btnBack.setOnClickListener(v -> finish());

        binding.btnPickStart.setOnClickListener(v -> pickDateTime(startCal, true));
        binding.btnPickEnd.setOnClickListener(v   -> pickDateTime(endCal,   false));

        binding.btnConfirmBooking.setOnClickListener(v -> {
            String service = binding.etService.getText().toString().trim();
            if (service.isEmpty()) { binding.etService.setError("Enter service type"); return; }
            if (startCal.getTimeInMillis() >= endCal.getTimeInMillis()) {
                Toast.makeText(this, "End time must be after start time", Toast.LENGTH_SHORT).show();
                return;
            }
            binding.progressBar.setVisibility(View.VISIBLE);
            binding.btnConfirmBooking.setEnabled(false);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            viewModel.createBooking(workerId, service, sdf.format(startCal.getTime()), sdf.format(endCal.getTime()));
        });

        viewModel.getBookingResult().observe(this, result -> {
            binding.progressBar.setVisibility(View.GONE);
            binding.btnConfirmBooking.setEnabled(true);
            if (result.isSuccess()) {
                Toast.makeText(this, "Booking created! Waiting for worker to accept.", Toast.LENGTH_LONG).show();
                finish();
            } else {
                Toast.makeText(this, result.getError(), Toast.LENGTH_LONG).show();
            }
        });
    }

    private void pickDateTime(Calendar cal, boolean isStart) {
        new DatePickerDialog(this, (view, y, m, d) -> {
            cal.set(y, m, d);
            new TimePickerDialog(this, (view2, h, min) -> {
                cal.set(Calendar.HOUR_OF_DAY, h);
                cal.set(Calendar.MINUTE, min);
                SimpleDateFormat disp = new SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault());
                if (isStart) binding.tvStartTime.setText(disp.format(cal.getTime()));
                else         binding.tvEndTime.setText(disp.format(cal.getTime()));
            }, cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE), false).show();
        }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show();
    }
}

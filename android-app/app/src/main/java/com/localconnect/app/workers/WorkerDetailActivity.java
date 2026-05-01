package com.localconnect.app.workers;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.localconnect.app.booking.BookingActivity;
import com.localconnect.app.databinding.ActivityWorkerDetailBinding;
import com.localconnect.app.utils.Constants;
import com.localconnect.app.utils.TokenManager;

public class WorkerDetailActivity extends AppCompatActivity {

    private ActivityWorkerDetailBinding binding;
    private WorkerViewModel viewModel;
    private String workerId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityWorkerDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        workerId = getIntent().getStringExtra(Constants.EXTRA_WORKER_ID);
        TokenManager tm = new TokenManager(this);
        viewModel = new ViewModelProvider(this).get(WorkerViewModel.class);
        viewModel.init(tm);

        binding.btnBack.setOnClickListener(v -> finish());

        viewModel.getWorker().observe(this, w -> {
            binding.progressBar.setVisibility(View.GONE);
            if (w == null) return;
            binding.tvSkills.setText("Skills: " + w.getSkillsString());
            binding.tvLocation.setText("Location: " + w.getLocation());
            binding.tvPrice.setText("Price Range: " + w.getPriceRangeString());
            binding.ratingBar.setRating((float) w.getRating());
            binding.tvReviews.setText(w.getTotalReviews() + " reviews");
            binding.tvVerified.setVisibility(w.isVerified() ? View.VISIBLE : View.GONE);
            binding.tvAvailability.setText(w.isAvailability() ? "Available" : "Not Available");

            binding.btnBook.setOnClickListener(v -> {
                if (!w.isAvailability()) {
                    Toast.makeText(this, "Worker is not available", Toast.LENGTH_SHORT).show();
                    return;
                }
                Intent intent = new Intent(this, BookingActivity.class);
                intent.putExtra(Constants.EXTRA_WORKER_ID, workerId);
                startActivity(intent);
            });
        });

        viewModel.getError().observe(this, err -> {
            binding.progressBar.setVisibility(View.GONE);
            if (err != null) Toast.makeText(this, err, Toast.LENGTH_LONG).show();
        });

        binding.progressBar.setVisibility(View.VISIBLE);
        viewModel.loadWorkerById(workerId);
    }
}

package com.localconnect.app.dashboard;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.localconnect.app.auth.LoginActivity;
import com.localconnect.app.databinding.ActivityDashboardBinding;
import com.localconnect.app.utils.Constants;
import com.localconnect.app.utils.TokenManager;
import com.localconnect.app.workers.WorkersListActivity;

public class DashboardActivity extends AppCompatActivity {

    private ActivityDashboardBinding binding;
    private DashboardViewModel viewModel;
    private BookingAdapter adapter;
    private TokenManager tokenManager;
    private String role;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        tokenManager = new TokenManager(this);
        role = tokenManager.getRole();

        viewModel = new ViewModelProvider(this).get(DashboardViewModel.class);
        viewModel.init(tokenManager);

        // Header
        binding.tvWelcome.setText("Hello, " + tokenManager.getName());
        binding.tvRole.setText(role != null ? role.toUpperCase() : "");

        // Setup RecyclerView
        adapter = new BookingAdapter(role, new BookingAdapter.ActionListener() {
            @Override public void onAccept(String bookingId)   { viewModel.acceptBooking(bookingId); }
            @Override public void onComplete(String bookingId) { viewModel.completeBooking(bookingId); }
            @Override public void onCancel(String bookingId)   { viewModel.cancelBooking(bookingId); }
            @Override public void onReview(String bookingId, int rating, String comment) {
                viewModel.submitReview(bookingId, rating, comment);
            }
        });
        binding.rvBookings.setLayoutManager(new LinearLayoutManager(this));
        binding.rvBookings.setAdapter(adapter);

        // Nav buttons
        binding.btnFindWorkers.setOnClickListener(v ->
                startActivity(new Intent(this, WorkersListActivity.class)));
        binding.btnLogout.setOnClickListener(v -> {
            tokenManager.clear();
            startActivity(new Intent(this, LoginActivity.class));
            finishAffinity();
        });

        // Show/hide "Find Workers" for customers only
        binding.btnFindWorkers.setVisibility(
                Constants.ROLE_CUSTOMER.equals(role) ? View.VISIBLE : View.GONE);

        // Observe bookings
        viewModel.getBookings().observe(this, bookings -> {
            binding.progressBar.setVisibility(View.GONE);
            binding.swipeRefresh.setRefreshing(false);
            if (bookings == null || bookings.isEmpty()) {
                binding.tvEmpty.setVisibility(View.VISIBLE);
                binding.rvBookings.setVisibility(View.GONE);
            } else {
                binding.tvEmpty.setVisibility(View.GONE);
                binding.rvBookings.setVisibility(View.VISIBLE);
                adapter.setBookings(bookings);
            }
        });

        viewModel.getActionResult().observe(this, msg -> {
            if (msg != null) {
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
                viewModel.loadBookings();
            }
        });

        viewModel.getError().observe(this, err -> {
            binding.progressBar.setVisibility(View.GONE);
            if (err != null) Toast.makeText(this, err, Toast.LENGTH_LONG).show();
        });

        binding.swipeRefresh.setOnRefreshListener(() -> viewModel.loadBookings());

        binding.progressBar.setVisibility(View.VISIBLE);
        viewModel.loadBookings();
    }

    @Override protected void onResume() {
        super.onResume();
        viewModel.loadBookings();
    }
}

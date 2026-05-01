package com.localconnect.app.workers;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.localconnect.app.auth.LoginActivity;
import com.localconnect.app.dashboard.DashboardActivity;
import com.localconnect.app.databinding.ActivityWorkersListBinding;
import com.localconnect.app.utils.TokenManager;

public class WorkersListActivity extends AppCompatActivity {

    private ActivityWorkersListBinding binding;
    private WorkerViewModel viewModel;
    private WorkerAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityWorkersListBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        TokenManager tokenManager = new TokenManager(this);
        viewModel = new ViewModelProvider(this).get(WorkerViewModel.class);
        viewModel.init(tokenManager);

        // Setup RecyclerView
        adapter = new WorkerAdapter(worker -> {
            Intent intent = new Intent(this, WorkerDetailActivity.class);
            intent.putExtra("worker_id", worker.getId());
            startActivity(intent);
        });
        binding.rvWorkers.setLayoutManager(new LinearLayoutManager(this));
        binding.rvWorkers.setAdapter(adapter);

        // Search
        binding.btnSearch.setOnClickListener(v -> {
            String skill    = binding.etSkill.getText().toString().trim();
            String location = binding.etLocation.getText().toString().trim();
            viewModel.loadWorkers(skill.isEmpty() ? null : skill,
                                  location.isEmpty() ? null : location);
        });

        // Navigation
        binding.btnDashboard.setOnClickListener(v ->
                startActivity(new Intent(this, DashboardActivity.class)));
        binding.btnLogout.setOnClickListener(v -> {
            tokenManager.clear();
            startActivity(new Intent(this, LoginActivity.class));
            finishAffinity();
        });

        // Observe workers
        viewModel.getWorkers().observe(this, workers -> {
            binding.progressBar.setVisibility(View.GONE);
            binding.swipeRefresh.setRefreshing(false);
            if (workers == null || workers.isEmpty()) {
                binding.tvEmpty.setVisibility(View.VISIBLE);
                binding.rvWorkers.setVisibility(View.GONE);
            } else {
                binding.tvEmpty.setVisibility(View.GONE);
                binding.rvWorkers.setVisibility(View.VISIBLE);
                adapter.setWorkers(workers);
            }
        });

        viewModel.getError().observe(this, err -> {
            binding.progressBar.setVisibility(View.GONE);
            binding.swipeRefresh.setRefreshing(false);
            if (err != null) Toast.makeText(this, err, Toast.LENGTH_LONG).show();
        });

        binding.swipeRefresh.setOnRefreshListener(() -> viewModel.loadWorkers(null, null));

        // Initial load
        binding.progressBar.setVisibility(View.VISIBLE);
        viewModel.loadWorkers(null, null);
    }
}

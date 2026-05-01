package com.localconnect.app.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.localconnect.app.dashboard.DashboardActivity;
import com.localconnect.app.databinding.ActivityRegisterBinding;
import com.localconnect.app.utils.TokenManager;

public class RegisterActivity extends AppCompatActivity {

    private ActivityRegisterBinding binding;
    private AuthViewModel viewModel;
    private String selectedRole = "customer";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityRegisterBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        TokenManager tokenManager = new TokenManager(this);
        viewModel = new ViewModelProvider(this).get(AuthViewModel.class);
        viewModel.init(tokenManager);

        // Role toggle
        binding.btnRoleCustomer.setOnClickListener(v -> {
            selectedRole = "customer";
            binding.btnRoleCustomer.setBackgroundColor(0xFF1A1A2E);
            binding.btnRoleWorker.setBackgroundColor(0xFFDDDDDD);
        });
        binding.btnRoleWorker.setOnClickListener(v -> {
            selectedRole = "worker";
            binding.btnRoleWorker.setBackgroundColor(0xFF1A1A2E);
            binding.btnRoleCustomer.setBackgroundColor(0xFFDDDDDD);
        });

        binding.btnRegister.setOnClickListener(v -> attemptRegister());
        binding.tvGoLogin.setOnClickListener(v -> finish());

        viewModel.getAuthResult().observe(this, result -> {
            binding.progressBar.setVisibility(View.GONE);
            binding.btnRegister.setEnabled(true);
            if (result.isSuccess()) {
                startActivity(new Intent(this, DashboardActivity.class));
                finishAffinity();
            } else {
                Toast.makeText(this, result.getError(), Toast.LENGTH_LONG).show();
            }
        });
    }

    private void attemptRegister() {
        String name     = binding.etName.getText().toString().trim();
        String email    = binding.etEmail.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();

        if (name.isEmpty())     { binding.etName.setError("Required");     return; }
        if (email.isEmpty())    { binding.etEmail.setError("Required");    return; }
        if (password.isEmpty()) { binding.etPassword.setError("Required"); return; }

        binding.progressBar.setVisibility(View.VISIBLE);
        binding.btnRegister.setEnabled(false);
        viewModel.register(name, email, password, selectedRole);
    }
}

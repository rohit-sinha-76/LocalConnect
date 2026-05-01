package com.localconnect.app.auth;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.localconnect.app.dashboard.DashboardActivity;
import com.localconnect.app.databinding.ActivityLoginBinding;
import com.localconnect.app.utils.TokenManager;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private AuthViewModel viewModel;
    private TokenManager tokenManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        tokenManager = new TokenManager(this);
        viewModel = new ViewModelProvider(this).get(AuthViewModel.class);
        viewModel.init(tokenManager);

        binding.btnLogin.setOnClickListener(v -> attemptLogin());
        binding.tvGoRegister.setOnClickListener(v ->
                startActivity(new Intent(this, RegisterActivity.class)));

        viewModel.getAuthResult().observe(this, result -> {
            binding.progressBar.setVisibility(View.GONE);
            binding.btnLogin.setEnabled(true);
            if (result.isSuccess()) {
                startActivity(new Intent(this, DashboardActivity.class));
                finishAffinity();
            } else {
                Toast.makeText(this, result.getError(), Toast.LENGTH_LONG).show();
            }
        });
    }

    private void attemptLogin() {
        String email    = binding.etEmail.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();

        if (email.isEmpty())    { binding.etEmail.setError("Required");    return; }
        if (password.isEmpty()) { binding.etPassword.setError("Required"); return; }

        binding.progressBar.setVisibility(View.VISIBLE);
        binding.btnLogin.setEnabled(false);
        viewModel.login(email, password);
    }
}

package com.localconnect.app.auth;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.localconnect.app.network.ApiService;
import com.localconnect.app.network.AuthInterceptor;
import com.localconnect.app.network.RetrofitClient;
import com.localconnect.app.network.response.ApiResponse;
import com.localconnect.app.network.response.AuthData;
import com.localconnect.app.utils.TokenManager;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthViewModel extends ViewModel {

    private final MutableLiveData<ApiResponse<AuthData>> authResult = new MutableLiveData<>();
    private ApiService api;
    private TokenManager tokenManager;

    public void init(TokenManager tokenManager) {
        this.tokenManager = tokenManager;
        AuthInterceptor interceptor = new AuthInterceptor(tokenManager);
        api = RetrofitClient.getInstance(interceptor).getApi();
    }

    public LiveData<ApiResponse<AuthData>> getAuthResult() { return authResult; }

    public void login(String email, String password) {
        Map<String, String> body = new HashMap<>();
        body.put("email",    email);
        body.put("password", password);

        api.login(body).enqueue(new Callback<ApiResponse<AuthData>>() {
            @Override
            public void onResponse(Call<ApiResponse<AuthData>> call, Response<ApiResponse<AuthData>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    ApiResponse<AuthData> res = response.body();
                    if (res.isSuccess() && res.getData() != null) {
                        AuthData d = res.getData();
                        tokenManager.saveSession(
                                d.getToken(),
                                d.getUser().getRole(),
                                d.getUser().getId(),
                                d.getUser().getName()
                        );
                    }
                    authResult.postValue(res);
                } else {
                    ApiResponse<AuthData> err = new ApiResponse<>();
                    authResult.postValue(buildError("Login failed. Check your credentials."));
                }
            }
            @Override
            public void onFailure(Call<ApiResponse<AuthData>> call, Throwable t) {
                authResult.postValue(buildError("Network error: " + t.getMessage()));
            }
        });
    }

    public void register(String name, String email, String password, String role) {
        Map<String, String> body = new HashMap<>();
        body.put("name",     name);
        body.put("email",    email);
        body.put("password", password);
        body.put("role",     role);

        api.register(body).enqueue(new Callback<ApiResponse<AuthData>>() {
            @Override
            public void onResponse(Call<ApiResponse<AuthData>> call, Response<ApiResponse<AuthData>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    ApiResponse<AuthData> res = response.body();
                    if (res.isSuccess() && res.getData() != null) {
                        AuthData d = res.getData();
                        tokenManager.saveSession(
                                d.getToken(),
                                d.getUser().getRole(),
                                d.getUser().getId(),
                                d.getUser().getName()
                        );
                    }
                    authResult.postValue(res);
                } else {
                    authResult.postValue(buildError("Registration failed."));
                }
            }
            @Override
            public void onFailure(Call<ApiResponse<AuthData>> call, Throwable t) {
                authResult.postValue(buildError("Network error: " + t.getMessage()));
            }
        });
    }

    @SuppressWarnings("unchecked")
    private <T> ApiResponse<T> buildError(String msg) {
        // Gson can't deserialize this inline — use raw type trick
        return (ApiResponse<T>) new ErrorResponse(msg);
    }

    private static class ErrorResponse extends ApiResponse<Object> {
        private final String errMsg;
        ErrorResponse(String msg) { errMsg = msg; }
        @Override public boolean isSuccess() { return false; }
        @Override public String getError()   { return errMsg; }
    }
}

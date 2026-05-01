package com.localconnect.app.workers;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.localconnect.app.models.WorkerProfile;
import com.localconnect.app.network.ApiService;
import com.localconnect.app.network.AuthInterceptor;
import com.localconnect.app.network.RetrofitClient;
import com.localconnect.app.network.response.ApiResponse;
import com.localconnect.app.network.response.WorkerListData;
import com.localconnect.app.utils.TokenManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class WorkerViewModel extends ViewModel {
    private final MutableLiveData<List<WorkerProfile>> workers = new MutableLiveData<>();
    private final MutableLiveData<WorkerProfile>       worker  = new MutableLiveData<>();
    private final MutableLiveData<String>              error   = new MutableLiveData<>();
    private ApiService api;

    public void init(TokenManager tm) {
        api = RetrofitClient.getInstance(new AuthInterceptor(tm)).getApi();
    }

    public LiveData<List<WorkerProfile>> getWorkers() { return workers; }
    public LiveData<WorkerProfile>       getWorker()  { return worker; }
    public LiveData<String>              getError()   { return error; }

    public void loadWorkers(String skill, String location) {
        api.getWorkers(1, 20, skill, location).enqueue(new Callback<ApiResponse<WorkerListData>>() {
            @Override
            public void onResponse(Call<ApiResponse<WorkerListData>> call, Response<ApiResponse<WorkerListData>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    workers.postValue(response.body().getData().getWorkers());
                } else {
                    workers.postValue(null);
                    error.postValue("Failed to load workers");
                }
            }
            @Override
            public void onFailure(Call<ApiResponse<WorkerListData>> call, Throwable t) {
                error.postValue("Network error: " + t.getMessage());
            }
        });
    }

    public void loadWorkerById(String id) {
        api.getWorkerById(id).enqueue(new Callback<ApiResponse<WorkerProfile>>() {
            @Override
            public void onResponse(Call<ApiResponse<WorkerProfile>> call, Response<ApiResponse<WorkerProfile>> response) {
                if (response.isSuccessful() && response.body() != null && response.body().isSuccess()) {
                    worker.postValue(response.body().getData());
                } else {
                    error.postValue("Failed to load worker profile");
                }
            }
            @Override
            public void onFailure(Call<ApiResponse<WorkerProfile>> call, Throwable t) {
                error.postValue("Network error: " + t.getMessage());
            }
        });
    }
}

package com.localconnect.app.booking;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.localconnect.app.models.Booking;
import com.localconnect.app.network.ApiService;
import com.localconnect.app.network.AuthInterceptor;
import com.localconnect.app.network.RetrofitClient;
import com.localconnect.app.network.response.ApiResponse;
import com.localconnect.app.utils.TokenManager;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookingViewModel extends ViewModel {
    private final MutableLiveData<ApiResponse<Booking>> bookingResult = new MutableLiveData<>();
    private ApiService api;

    public void init(TokenManager tm) {
        api = RetrofitClient.getInstance(new AuthInterceptor(tm)).getApi();
    }

    public LiveData<ApiResponse<Booking>> getBookingResult() { return bookingResult; }

    public void createBooking(String workerId, String service, String startISO, String endISO) {
        Map<String, Object> body = new HashMap<>();
        body.put("workerId", workerId);
        body.put("service",  service);
        Map<String, String> timeSlot = new HashMap<>();
        timeSlot.put("start", startISO);
        timeSlot.put("end",   endISO);
        body.put("timeSlot", timeSlot);

        api.createBooking(body).enqueue(new Callback<ApiResponse<Booking>>() {
            @Override
            public void onResponse(Call<ApiResponse<Booking>> call, Response<ApiResponse<Booking>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    bookingResult.postValue(response.body());
                } else {
                    bookingResult.postValue(makeError("Booking failed. Slot may be taken."));
                }
            }
            @Override
            public void onFailure(Call<ApiResponse<Booking>> call, Throwable t) {
                bookingResult.postValue(makeError("Network error: " + t.getMessage()));
            }
        });
    }

    @SuppressWarnings("unchecked")
    private ApiResponse<Booking> makeError(String msg) {
        return new ApiResponse<Booking>() {
            @Override public boolean isSuccess() { return false; }
            @Override public String getError()   { return msg; }
        };
    }
}

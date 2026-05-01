package com.localconnect.app.dashboard;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.localconnect.app.models.Booking;
import com.localconnect.app.models.Review;
import com.localconnect.app.network.ApiService;
import com.localconnect.app.network.AuthInterceptor;
import com.localconnect.app.network.RetrofitClient;
import com.localconnect.app.network.response.ApiResponse;
import com.localconnect.app.utils.Constants;
import com.localconnect.app.utils.TokenManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DashboardViewModel extends ViewModel {
    private final MutableLiveData<List<Booking>> bookings     = new MutableLiveData<>();
    private final MutableLiveData<String>        actionResult = new MutableLiveData<>();
    private final MutableLiveData<String>        error        = new MutableLiveData<>();
    private ApiService api;
    private String role;

    public void init(TokenManager tm) {
        role = tm.getRole();
        api  = RetrofitClient.getInstance(new AuthInterceptor(tm)).getApi();
    }

    public LiveData<List<Booking>> getBookings()     { return bookings; }
    public LiveData<String>        getActionResult() { return actionResult; }
    public LiveData<String>        getError()        { return error; }

    public void loadBookings() {
        Call<ApiResponse<List<Booking>>> call = Constants.ROLE_WORKER.equals(role)
                ? api.getWorkerBookings() : api.getUserBookings();
        call.enqueue(new Callback<ApiResponse<List<Booking>>>() {
            @Override public void onResponse(Call<ApiResponse<List<Booking>>> c, Response<ApiResponse<List<Booking>>> r) {
                if (r.isSuccessful() && r.body() != null && r.body().isSuccess()) {
                    bookings.postValue(r.body().getData());
                } else { error.postValue("Failed to load bookings"); }
            }
            @Override public void onFailure(Call<ApiResponse<List<Booking>>> c, Throwable t) {
                error.postValue("Network error: " + t.getMessage());
            }
        });
    }

    public void acceptBooking(String id) {
        api.acceptBooking(id).enqueue(simpleCallback("Booking accepted!"));
    }

    public void completeBooking(String id) {
        api.completeBooking(id).enqueue(simpleCallback("Booking marked complete!"));
    }

    public void cancelBooking(String id) {
        Map<String, String> body = new HashMap<>();
        body.put("cancelReason", "Cancelled by user");
        api.cancelBooking(id, body).enqueue(simpleCallback("Booking cancelled."));
    }

    public void submitReview(String bookingId, int rating, String comment) {
        Map<String, Object> body = new HashMap<>();
        body.put("bookingId", bookingId);
        body.put("rating",    rating);
        body.put("comment",   comment);
        api.createReview(body).enqueue(new Callback<ApiResponse<Review>>() {
            @Override
            public void onResponse(Call<ApiResponse<Review>> call,
                                   Response<ApiResponse<Review>> response) {
                actionResult.postValue(
                    response.isSuccessful() && response.body() != null && response.body().isSuccess()
                    ? "Review submitted!" : "Failed to submit review");
            }
            @Override
            public void onFailure(Call<ApiResponse<Review>> call, Throwable t) {
                error.postValue("Network error: " + t.getMessage());
            }
        });
    }

    private Callback<ApiResponse<Booking>> simpleCallback(String successMsg) {
        return new Callback<ApiResponse<Booking>>() {
            @Override
            public void onResponse(Call<ApiResponse<Booking>> call, Response<ApiResponse<Booking>> response) {
                actionResult.postValue(
                    response.isSuccessful() && response.body() != null && response.body().isSuccess()
                    ? successMsg : "Action failed");
            }
            @Override
            public void onFailure(Call<ApiResponse<Booking>> call, Throwable t) {
                error.postValue("Network error: " + t.getMessage());
            }
        };
    }
}

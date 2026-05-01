package com.localconnect.app.network;

import com.localconnect.app.models.Booking;
import com.localconnect.app.models.Review;
import com.localconnect.app.models.WorkerProfile;
import com.localconnect.app.network.response.ApiResponse;
import com.localconnect.app.network.response.AuthData;
import com.localconnect.app.network.response.WorkerListData;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {

    // ── Auth ─────────────────────────────────────────────────────────────────
    @POST("auth/register")
    Call<ApiResponse<AuthData>> register(@Body Map<String, String> body);

    @POST("auth/login")
    Call<ApiResponse<AuthData>> login(@Body Map<String, String> body);

    // ── Workers ───────────────────────────────────────────────────────────────
    @GET("workers")
    Call<ApiResponse<WorkerListData>> getWorkers(
            @Query("page")     int page,
            @Query("limit")    int limit,
            @Query("skill")    String skill,
            @Query("location") String location
    );

    @GET("workers/{id}")
    Call<ApiResponse<WorkerProfile>> getWorkerById(@Path("id") String id);

    // ── Bookings ──────────────────────────────────────────────────────────────
    @POST("bookings")
    Call<ApiResponse<Booking>> createBooking(@Body Map<String, Object> body);

    @GET("bookings/user")
    Call<ApiResponse<List<Booking>>> getUserBookings();

    @GET("bookings/worker")
    Call<ApiResponse<List<Booking>>> getWorkerBookings();

    @PATCH("bookings/{id}/accept")
    Call<ApiResponse<Booking>> acceptBooking(@Path("id") String id);

    @PATCH("bookings/{id}/complete")
    Call<ApiResponse<Booking>> completeBooking(@Path("id") String id);

    @PATCH("bookings/{id}/cancel")
    Call<ApiResponse<Booking>> cancelBooking(@Path("id") String id, @Body Map<String, String> body);

    // ── Reviews ───────────────────────────────────────────────────────────────
    @POST("reviews")
    Call<ApiResponse<Review>> createReview(@Body Map<String, Object> body);

    @GET("reviews/worker/{workerId}")
    Call<ApiResponse<List<Review>>> getWorkerReviews(@Path("workerId") String workerId);
}

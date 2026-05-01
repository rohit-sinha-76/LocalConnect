package com.localconnect.app.models;
import com.google.gson.annotations.SerializedName;

public class Review {
    @SerializedName("_id")       private String id;
    @SerializedName("userId")    private Object userId;
    @SerializedName("workerId")  private String workerId;
    @SerializedName("bookingId") private String bookingId;
    @SerializedName("rating")    private int rating;
    @SerializedName("comment")   private String comment;
    @SerializedName("createdAt") private String createdAt;

    public String getId()        { return id; }
    public int getRating()       { return rating; }
    public String getComment()   { return comment; }
    public String getCreatedAt() { return createdAt; }
    public String getBookingId() { return bookingId; }

    public String getReviewerName() {
        if (userId instanceof java.util.Map) {
            Object n = ((java.util.Map<?,?>)userId).get("name");
            return n != null ? n.toString() : "Customer";
        }
        return "Customer";
    }
}

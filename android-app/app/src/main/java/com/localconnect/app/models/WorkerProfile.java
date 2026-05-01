package com.localconnect.app.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class WorkerProfile {
    @SerializedName("_id")        private String id;
    @SerializedName("userId")     private Object userId;  // can be string or User object
    @SerializedName("skills")     private List<String> skills;
    @SerializedName("location")   private String location;
    @SerializedName("priceRange") private PriceRange priceRange;
    @SerializedName("availability") private boolean availability;
    @SerializedName("rating")     private double rating;
    @SerializedName("totalReviews") private int totalReviews;
    @SerializedName("isVerified") private boolean isVerified;

    public String getId()              { return id; }
    public List<String> getSkills()    { return skills; }
    public String getLocation()        { return location; }
    public PriceRange getPriceRange()  { return priceRange; }
    public boolean isAvailability()    { return availability; }
    public double getRating()          { return rating; }
    public int getTotalReviews()       { return totalReviews; }
    public boolean isVerified()        { return isVerified; }

    public String getSkillsString() {
        if (skills == null || skills.isEmpty()) return "N/A";
        return String.join(", ", skills);
    }

    public String getPriceRangeString() {
        if (priceRange == null) return "N/A";
        return "₹" + (int)priceRange.getMin() + " – ₹" + (int)priceRange.getMax();
    }
}

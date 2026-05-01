package com.localconnect.app.models;
import com.google.gson.annotations.SerializedName;

public class PriceRange {
    @SerializedName("min") private double min;
    @SerializedName("max") private double max;
    public double getMin() { return min; }
    public double getMax() { return max; }
}

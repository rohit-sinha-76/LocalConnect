package com.localconnect.app.models;
import com.google.gson.annotations.SerializedName;

public class TimeSlot {
    @SerializedName("start") private String start;
    @SerializedName("end")   private String end;
    public String getStart() { return start; }
    public String getEnd()   { return end; }
}

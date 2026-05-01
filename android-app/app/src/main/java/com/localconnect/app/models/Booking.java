package com.localconnect.app.models;

import com.google.gson.annotations.SerializedName;

public class Booking {
    @SerializedName("_id")          private String id;
    @SerializedName("userId")       private Object userId;    // String or User
    @SerializedName("workerId")     private Object workerId;  // String or WorkerProfile
    @SerializedName("service")      private String service;
    @SerializedName("timeSlot")     private TimeSlot timeSlot;
    @SerializedName("status")       private String status;
    @SerializedName("cancelReason") private String cancelReason;
    @SerializedName("createdAt")    private String createdAt;

    public String getId()           { return id; }
    public String getService()      { return service; }
    public TimeSlot getTimeSlot()   { return timeSlot; }
    public String getStatus()       { return status; }
    public String getCancelReason() { return cancelReason; }
    public String getCreatedAt()    { return createdAt; }

    public String getWorkerLocation() {
        if (workerId instanceof java.util.Map) {
            Object loc = ((java.util.Map<?,?>)workerId).get("location");
            return loc != null ? loc.toString() : "N/A";
        }
        return "N/A";
    }

    public String getCustomerName() {
        if (userId instanceof java.util.Map) {
            Object n = ((java.util.Map<?,?>)userId).get("name");
            return n != null ? n.toString() : "Customer";
        }
        return "Customer";
    }

    public boolean isPending()   { return "PENDING".equals(status); }
    public boolean isConfirmed() { return "CONFIRMED".equals(status); }
    public boolean isCompleted() { return "COMPLETED".equals(status); }
}

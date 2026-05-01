package com.localconnect.app.network.response;
import com.google.gson.annotations.SerializedName;
import com.localconnect.app.models.WorkerProfile;
import java.util.List;

public class WorkerListData {
    @SerializedName("workers")    private List<WorkerProfile> workers;
    @SerializedName("pagination") private Pagination pagination;
    public List<WorkerProfile> getWorkers()  { return workers; }
    public Pagination getPagination()        { return pagination; }
}

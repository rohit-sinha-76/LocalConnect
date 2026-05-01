package com.localconnect.app.network.response;
import com.google.gson.annotations.SerializedName;

public class Pagination {
    @SerializedName("page")  private int page;
    @SerializedName("limit") private int limit;
    @SerializedName("total") private int total;
    public int getPage()  { return page; }
    public int getLimit() { return limit; }
    public int getTotal() { return total; }
    public boolean hasMore() { return page * limit < total; }
}

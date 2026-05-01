package com.localconnect.app.network.response;
import com.google.gson.annotations.SerializedName;
import com.localconnect.app.models.User;

public class AuthData {
    @SerializedName("user")  private User user;
    @SerializedName("token") private String token;
    public User getUser()    { return user; }
    public String getToken() { return token; }
}

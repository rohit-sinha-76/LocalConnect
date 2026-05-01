package com.localconnect.app.models;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("_id")   private String id;
    @SerializedName("name")  private String name;
    @SerializedName("email") private String email;
    @SerializedName("role")  private String role;

    public String getId()    { return id; }
    public String getName()  { return name; }
    public String getEmail() { return email; }
    public String getRole()  { return role; }
}

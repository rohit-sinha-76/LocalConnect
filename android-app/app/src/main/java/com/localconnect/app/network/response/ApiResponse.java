package com.localconnect.app.network.response;

public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String error;

    public boolean isSuccess() { return success; }
    public T getData()         { return data; }
    public String getMessage() { return message; }
    public String getError()   { return error != null ? error : message; }
}

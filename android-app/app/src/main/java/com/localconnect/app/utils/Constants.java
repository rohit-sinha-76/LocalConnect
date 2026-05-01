package com.localconnect.app.utils;

public class Constants {
    // ── Change this to your server IP when testing on a physical device ──────
    // Emulator  → http://10.0.2.2:5000/api
    // Real device on same WiFi → http://192.168.x.x:5000/api
    public static final String BASE_URL = "http://10.0.2.2:5000/api/";

    // SharedPreferences keys
    public static final String PREF_NAME   = "localconnect_prefs";
    public static final String KEY_TOKEN   = "jwt_token";
    public static final String KEY_ROLE    = "user_role";
    public static final String KEY_USER_ID = "user_id";
    public static final String KEY_NAME    = "user_name";

    // Roles
    public static final String ROLE_CUSTOMER = "customer";
    public static final String ROLE_WORKER   = "worker";
    public static final String ROLE_ADMIN    = "admin";

    // Intent extras
    public static final String EXTRA_WORKER_ID   = "worker_id";
    public static final String EXTRA_WORKER_NAME = "worker_name";
    public static final String EXTRA_BOOKING_ID  = "booking_id";
}

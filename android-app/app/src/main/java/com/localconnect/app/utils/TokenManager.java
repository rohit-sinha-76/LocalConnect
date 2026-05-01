package com.localconnect.app.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class TokenManager {
    private final SharedPreferences prefs;

    public TokenManager(Context context) {
        prefs = context.getSharedPreferences(Constants.PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveSession(String token, String role, String userId, String name) {
        prefs.edit()
             .putString(Constants.KEY_TOKEN,   token)
             .putString(Constants.KEY_ROLE,    role)
             .putString(Constants.KEY_USER_ID, userId)
             .putString(Constants.KEY_NAME,    name)
             .apply();
    }

    public String getToken()  { return prefs.getString(Constants.KEY_TOKEN,   null); }
    public String getRole()   { return prefs.getString(Constants.KEY_ROLE,    null); }
    public String getUserId() { return prefs.getString(Constants.KEY_USER_ID, null); }
    public String getName()   { return prefs.getString(Constants.KEY_NAME,    null); }

    public boolean isLoggedIn() { return getToken() != null; }

    public void clear() { prefs.edit().clear().apply(); }
}

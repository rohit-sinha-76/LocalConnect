package com.localconnect.app.dashboard;

import android.app.AlertDialog;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.localconnect.app.R;
import com.localconnect.app.models.Booking;
import com.localconnect.app.utils.Constants;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

public class BookingAdapter extends RecyclerView.Adapter<BookingAdapter.ViewHolder> {

    public interface ActionListener {
        void onAccept(String bookingId);
        void onComplete(String bookingId);
        void onCancel(String bookingId);
        void onReview(String bookingId, int rating, String comment);
    }

    private List<Booking> bookings = new ArrayList<>();
    private final String role;
    private final ActionListener listener;

    public BookingAdapter(String role, ActionListener listener) {
        this.role = role;
        this.listener = listener;
    }

    public void setBookings(List<Booking> list) {
        this.bookings = list;
        notifyDataSetChanged();
    }

    @NonNull @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                               .inflate(R.layout.item_booking_card, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder h, int pos) {
        Booking b = bookings.get(pos);

        h.tvService.setText(b.getService());
        h.tvStatus.setText(b.getStatus());
        h.tvTime.setText("From: " + formatTime(b.getTimeSlot() != null ? b.getTimeSlot().getStart() : ""));

        // Status color
        int color;
        switch (b.getStatus()) {
            case "CONFIRMED":  color = 0xFF1565C0; break;
            case "COMPLETED":  color = 0xFF2E7D32; break;
            case "CANCELLED":  color = 0xFFC62828; break;
            case "EXPIRED":    color = 0xFF616161; break;
            default:           color = 0xFFF57F17; // PENDING
        }
        h.tvStatus.setTextColor(color);

        // Show customer/worker info
        if (Constants.ROLE_WORKER.equals(role)) {
            h.tvInfo.setText("Customer: " + b.getCustomerName());
        } else {
            h.tvInfo.setText("Location: " + b.getWorkerLocation());
        }

        // Action buttons
        boolean canCancel  = b.isPending() || b.isConfirmed();
        boolean canAccept  = b.isPending()   && Constants.ROLE_WORKER.equals(role);
        boolean canComplete= b.isConfirmed() && Constants.ROLE_WORKER.equals(role);
        boolean canReview  = b.isCompleted() && Constants.ROLE_CUSTOMER.equals(role);

        h.btnCancel.setVisibility(canCancel   ? View.VISIBLE : View.GONE);
        h.btnAccept.setVisibility(canAccept   ? View.VISIBLE : View.GONE);
        h.btnComplete.setVisibility(canComplete? View.VISIBLE : View.GONE);
        h.btnReview.setVisibility(canReview   ? View.VISIBLE : View.GONE);

        h.btnAccept.setOnClickListener(v   -> listener.onAccept(b.getId()));
        h.btnComplete.setOnClickListener(v -> listener.onComplete(b.getId()));
        h.btnCancel.setOnClickListener(v   -> listener.onCancel(b.getId()));
        h.btnReview.setOnClickListener(v   -> showReviewDialog(h.itemView, b.getId()));
    }

    private void showReviewDialog(View anchor, String bookingId) {
        View dialogView = LayoutInflater.from(anchor.getContext())
                                        .inflate(R.layout.dialog_review, null);
        RatingBar rb = dialogView.findViewById(R.id.rb_review);
        EditText  et = dialogView.findViewById(R.id.et_comment);

        new AlertDialog.Builder(anchor.getContext())
                .setTitle("Leave a Review")
                .setView(dialogView)
                .setPositiveButton("Submit", (d, w) -> {
                    int    rating  = (int) rb.getRating();
                    String comment = et.getText().toString().trim();
                    listener.onReview(bookingId, rating, comment);
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    @Override public int getItemCount() { return bookings.size(); }

    private String formatTime(String iso) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date d = sdf.parse(iso);
            SimpleDateFormat out = new SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault());
            return out.format(d);
        } catch (Exception e) { return iso; }
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvService, tvStatus, tvTime, tvInfo;
        Button btnAccept, btnComplete, btnCancel, btnReview;
        ViewHolder(View v) {
            super(v);
            tvService  = v.findViewById(R.id.tv_service);
            tvStatus   = v.findViewById(R.id.tv_status);
            tvTime     = v.findViewById(R.id.tv_time);
            tvInfo     = v.findViewById(R.id.tv_info);
            btnAccept  = v.findViewById(R.id.btn_accept);
            btnComplete= v.findViewById(R.id.btn_complete);
            btnCancel  = v.findViewById(R.id.btn_cancel);
            btnReview  = v.findViewById(R.id.btn_review);
        }
    }
}

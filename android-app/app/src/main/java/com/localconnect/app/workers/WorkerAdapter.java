package com.localconnect.app.workers;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.localconnect.app.R;
import com.localconnect.app.models.WorkerProfile;

import java.util.ArrayList;
import java.util.List;

public class WorkerAdapter extends RecyclerView.Adapter<WorkerAdapter.ViewHolder> {

    public interface OnWorkerClick { void onClick(WorkerProfile worker); }

    private List<WorkerProfile> workers = new ArrayList<>();
    private final OnWorkerClick listener;

    public WorkerAdapter(OnWorkerClick listener) { this.listener = listener; }

    public void setWorkers(List<WorkerProfile> list) {
        this.workers = list;
        notifyDataSetChanged();
    }

    @NonNull @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                               .inflate(R.layout.item_worker_card, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder h, int pos) {
        WorkerProfile w = workers.get(pos);
        h.tvSkills.setText(w.getSkillsString());
        h.tvLocation.setText(w.getLocation());
        h.tvPrice.setText(w.getPriceRangeString());
        h.ratingBar.setRating((float) w.getRating());
        h.tvRatingCount.setText("(" + w.getTotalReviews() + " reviews)");
        h.tvVerified.setVisibility(w.isVerified() ? View.VISIBLE : View.GONE);
        h.itemView.setOnClickListener(v -> listener.onClick(w));
    }

    @Override public int getItemCount() { return workers.size(); }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView  tvSkills, tvLocation, tvPrice, tvRatingCount, tvVerified;
        RatingBar ratingBar;
        ViewHolder(View v) {
            super(v);
            tvSkills      = v.findViewById(R.id.tv_skills);
            tvLocation    = v.findViewById(R.id.tv_location);
            tvPrice       = v.findViewById(R.id.tv_price);
            ratingBar     = v.findViewById(R.id.rating_bar);
            tvRatingCount = v.findViewById(R.id.tv_rating_count);
            tvVerified    = v.findViewById(R.id.tv_verified);
        }
    }
}

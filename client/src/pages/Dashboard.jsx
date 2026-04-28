import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

function decodeToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

const STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900", icon: "⏳" },
  CONFIRMED: { label: "Confirmed", color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white", icon: "✓" },
  COMPLETED: { label: "Completed", color: "bg-gradient-to-r from-emerald-500 to-green-500 text-white", icon: "🎉" },
  CANCELLED: { label: "Cancelled", color: "bg-gradient-to-r from-red-500 to-rose-500 text-white", icon: "✕" },
  EXPIRED: { label: "Expired", color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white", icon: "⏰" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => decodeToken());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState({});
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [workerReviews, setWorkerReviews] = useState([]);
  const [fetchReviewsLoading, setFetchReviewsLoading] = useState(false);

  const loadBookings = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const url = user.role === "customer" ? "/bookings/user" : "/bookings/worker";
      const response = await api.get(url);
      setBookings(response.data.data);
    } catch {
      setError("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadBookings();
  }, [user, loadBookings, navigate]);

  useEffect(() => {
    if (user && user.role === "worker" && bookings.length > 0 && workerReviews.length === 0) {
      const fetchWorkerReviews = async () => {
        try {
          setFetchReviewsLoading(true);
          const workerProfileId =
            typeof bookings[0].workerId === "object" ? bookings[0].workerId._id : bookings[0].workerId;
          const response = await api.get(`/reviews/worker/${workerProfileId}`);
          setWorkerReviews(response.data.data);
        } catch {
          // Optional
        } finally {
          setFetchReviewsLoading(false);
        }
      };
      fetchWorkerReviews();
    }
  }, [user, bookings, workerReviews.length]);

  const handleAction = async (bookingId, action) => {
    try {
      setError("");
      if (action === "cancel") {
        await api.patch(`/bookings/${bookingId}/cancel`, { cancelReason: "Cancelled by user" });
      } else if (action === "complete") {
        await api.patch(`/bookings/${bookingId}/complete`);
      }
      loadBookings();
    } catch (err) {
      setError(err.message || "Action failed");
    }
  };

  const handleReviewSubmit = async () => {
    setReviewError("");
    if (!reviewForm.comment) {
      setReviewError("Please provide a comment");
      return;
    }

    const currentBookingId = reviewForm.bookingId;
    setReviewLoading(true);
    try {
      await api.post("/reviews", {
        bookingId: currentBookingId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewForm({ bookingId: "", rating: 5, comment: "" });
      setReviews((prev) => ({ ...prev, [currentBookingId]: true }));
      loadBookings();
    } catch (err) {
      setReviewError(err.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-purple-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl shadow-purple-500/20">
        <h1 className="text-3xl font-bold">
          {user.role === "customer" ? "My Bookings" : "Worker Dashboard"}
        </h1>
        <p className="mt-2 text-lg text-white/80">
          {user.role === "customer"
            ? "Track and manage your bookings"
            : "Manage incoming bookings and reviews"}
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-16 text-center">
          <p className="text-xl font-semibold text-purple-600">No bookings found</p>
          <p className="mt-2 text-sm text-purple-500">
            {user.role === "customer"
              ? "Browse workers to make your first booking"
              : "No bookings received yet"}
          </p>
          {user.role === "customer" && (
            <Button
              onClick={() => navigate("/workers")}
              className="mt-4 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold shadow-lg shadow-purple-500/20"
            >
              Find Workers
            </Button>
          )}
        </div>
      )}

      {/* Bookings List */}
      <div className="flex flex-col gap-5">
        {bookings.map((booking) => {
          const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.EXPIRED;

          return (
            <Card key={booking._id} className="group rounded-2xl border-0 shadow-md transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900">{booking.service}</CardTitle>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-sm ${status.color}`}>
                    <span>{status.icon}</span>
                    {status.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600">
                    <span className="font-semibold text-gray-800">From:</span>{" "}
                    {formatDate(booking.timeSlot.start)}
                  </p>
                  <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600">
                    <span className="font-semibold text-gray-800">To:</span>{" "}
                    {formatDate(booking.timeSlot.end)}
                  </p>
                </div>

                {user.role === "customer" && booking.workerId && (
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">📍 Worker:</span>{" "}
                    {booking.workerId.location || "N/A"}
                  </p>
                )}
                {user.role === "worker" && booking.userId && (
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">👤 Customer:</span>{" "}
                    {booking.userId.name || "N/A"}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                      onClick={() => handleAction(booking._id, "cancel")}
                    >
                      Cancel
                    </Button>
                  )}

                  {user.role === "worker" && booking.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 font-semibold text-white shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
                      onClick={() => handleAction(booking._id, "complete")}
                    >
                      Mark Complete ✓
                    </Button>
                  )}
                </div>

                {/* Review Section (Customer only, for completed bookings) */}
                {user.role === "customer" && booking.status === "COMPLETED" && !reviews[booking._id] && (
                  <div className="mt-2 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-5">
                    <p className="mb-3 font-semibold text-sm text-purple-700">⭐ Leave a Review</p>

                    {reviewError && reviewForm.bookingId === booking._id && (
                      <p className="mb-2 text-sm text-red-600">{reviewError}</p>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <Label className="text-xs text-gray-500">Rating:</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() =>
                              setReviewForm({ ...reviewForm, bookingId: booking._id, rating: n })
                            }
                            className={`text-2xl transition-transform hover:scale-125 ${
                              n <= (reviewForm.bookingId === booking._id ? reviewForm.rating : 0) ? "text-amber-500" : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      placeholder="Share your experience..."
                      value={reviewForm.bookingId === booking._id ? reviewForm.comment : ""}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, bookingId: booking._id, comment: e.target.value })
                      }
                      className="mb-3 rounded-xl border-purple-200 bg-white focus:border-purple-400 focus:ring-purple-400/20 transition-all"
                    />

                    <Button
                      size="sm"
                      disabled={reviewLoading}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-md shadow-purple-500/20 hover:shadow-lg transition-all"
                      onClick={handleReviewSubmit}
                    >
                      {reviewLoading ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                )}

                {user.role === "customer" && booking.status === "COMPLETED" && reviews[booking._id] && (
                  <p className="mt-1 text-sm font-semibold text-emerald-600">✓ Review submitted</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Worker Reviews Section */}
      {user.role === "worker" && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold">
            <span className="gradient-text">Your Reviews</span>
          </h2>

          {workerReviews.length === 0 && !fetchReviewsLoading && (
            <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-8 text-center">
              <p className="text-sm text-purple-500">No reviews yet</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {workerReviews.map((review) => (
              <Card key={review._id} className="rounded-2xl border-0 shadow-md">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-500 text-xl">★</span>
                        <span className="font-bold text-gray-900">{review.rating}/5</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                      <p className="mt-1.5 text-xs text-gray-400">
                        — {review.userId?.name || "Customer"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

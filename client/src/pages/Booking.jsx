import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Booking() {
  const { id: workerId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ service: "", start: "", end: "" });
  const [workerName, setWorkerName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchWorker();
  }, [workerId]);

  const fetchWorker = async () => {
    try {
      const response = await api.get(`/workers/${workerId}`);
      setWorkerName(response.data.data.userId?.name || "Worker");
    } catch {
      setError("Failed to load worker details");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.service || !form.start || !form.end) {
      setError("All fields are required");
      return;
    }

    const start = new Date(form.start);
    const end = new Date(form.end);

    if (start >= end) {
      setError("End time must be after start time");
      return;
    }

    setLoading(true);

    try {
      await api.post("/bookings", {
        workerId,
        service: form.service.trim(),
        timeSlot: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });

      setSuccess("Booking created successfully! View it in your Dashboard.");
      setForm({ service: "", start: "", end: "" });
    } catch (err) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-purple-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 opacity-15 blur-3xl"></div>
        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 opacity-15 blur-3xl"></div>
      </div>

      <Card className="relative w-full max-w-lg border-0 shadow-2xl shadow-purple-500/10">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold">
            <span className="gradient-text">Book Service</span>
          </CardTitle>
          <CardDescription>Booking with <span className="font-semibold text-purple-600">{workerName}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                ✓ {success}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="service" className="text-sm font-medium text-gray-700">Service</Label>
              <Input
                id="service"
                name="service"
                type="text"
                placeholder="e.g. Plumbing, Electrical Work"
                value={form.service}
                onChange={handleChange}
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="start" className="text-sm font-medium text-gray-700">Start Time</Label>
                <Input
                  id="start"
                  name="start"
                  type="datetime-local"
                  value={form.start}
                  onChange={handleChange}
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="end" className="text-sm font-medium text-gray-700">End Time</Label>
                <Input
                  id="end"
                  name="end"
                  type="datetime-local"
                  value={form.end}
                  onChange={handleChange}
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-purple-400 focus:bg-white focus:ring-purple-400/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                {loading ? "Creating Booking..." : "Confirm Booking"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/workers")}
                className="h-12 rounded-xl border-gray-200 font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Workers() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ skill: "", location: "" });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async (params = {}) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/workers", { params });
      setWorkers(response.data.data.workers);
    } catch {
      setError("Failed to load workers");
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers(filters);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-purple-600">Finding workers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl shadow-purple-500/20">
        <h1 className="text-3xl font-bold">Find Skilled Workers</h1>
        <p className="mt-2 text-lg text-white/80">Search and book local workers for any job</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-8 flex flex-wrap items-center gap-3">
        <Input
          name="skill"
          placeholder="🔍 Search by skill..."
          value={filters.skill}
          onChange={handleFilterChange}
          className="max-w-xs rounded-xl border-gray-200 bg-white shadow-sm focus:border-purple-400 focus:ring-purple-400/20 transition-all"
        />
        <Input
          name="location"
          placeholder="📍 Filter by location..."
          value={filters.location}
          onChange={handleFilterChange}
          className="max-w-xs rounded-xl border-gray-200 bg-white shadow-sm focus:border-purple-400 focus:ring-purple-400/20 transition-all"
        />
        <Button type="submit" className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all">
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* Empty State */}
      {!error && workers.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-16 text-center">
          <p className="text-xl font-semibold text-purple-600">No workers available</p>
          <p className="mt-2 text-sm text-purple-500">Try adjusting your search filters</p>
        </div>
      )}

      {/* Worker Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker, i) => {
          const gradients = [
            "from-violet-500 to-purple-500",
            "from-blue-500 to-cyan-500",
            "from-emerald-500 to-teal-500",
            "from-orange-500 to-pink-500",
            "from-indigo-500 to-violet-500",
            "from-rose-500 to-pink-500",
          ];
          const grad = gradients[i % gradients.length];

          return (
            <Card
              key={worker._id}
              className="group overflow-hidden rounded-2xl border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
            >
              {/* Colorful top bar */}
              <div className={`h-2 bg-gradient-to-r ${grad}`}></div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-900">{worker.userId?.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-600">
                    <span className="text-base">📍</span>
                    {worker.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-800">Price:</span> ₹{worker.priceRange.min} – ₹{worker.priceRange.max}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="text-amber-500 text-lg">★</span>
                    <span className="font-bold text-gray-800">{worker.rating.toFixed(1)}</span>
                    <span className="text-gray-400">/ 5.0</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{worker.totalReviews} reviews</span>
                  </p>
                </div>

                <Button
                  onClick={() => navigate(`/workers/${worker._id}`)}
                  className={`mt-1 h-11 rounded-xl bg-gradient-to-r ${grad} font-semibold text-white shadow-md hover:shadow-lg transition-all`}
                >
                  Book Service →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import api from "./api";

export const authService = {
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async login(data) {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};

export const workerService = {
  async getAll(params = {}) {
    const response = await api.get("/workers", { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/workers/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post("/workers", data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/workers/${id}`, data);
    return response.data;
  },
};

export const bookingService = {
  async create(data) {
    const response = await api.post("/bookings", data);
    return response.data;
  },

  async getUserBookings() {
    const response = await api.get("/bookings/user");
    return response.data;
  },

  async getWorkerBookings() {
    const response = await api.get("/bookings/worker");
    return response.data;
  },

  async accept(id) {
    const response = await api.patch(`/bookings/${id}/accept`);
    return response.data;
  },

  async cancel(id, reason) {
    const response = await api.patch(`/bookings/${id}/cancel`, { cancelReason: reason });
    return response.data;
  },

  async complete(id) {
    const response = await api.patch(`/bookings/${id}/complete`);
    return response.data;
  },
};

export const reviewService = {
  async create(data) {
    const response = await api.post("/reviews", data);
    return response.data;
  },

  async getWorkerReviews(workerId) {
    const response = await api.get(`/reviews/worker/${workerId}`);
    return response.data;
  },
};

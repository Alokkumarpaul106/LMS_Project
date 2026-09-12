import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// BASE_URL e "/api" thake, kintu media file "/media/..." e serve hoy,
// tai "/api" bad diye server root ber kora hocche
const SERVER_ROOT = BASE_URL.replace(/\/api\/?$/, "");


export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path; // already full URL hole tai thak
  return `${SERVER_ROOT}${path}`;
};

// ===== Base axios instance =====
const api = axios.create({
  baseURL: BASE_URL,
});

// ===== Request interceptor: attach access token to every request =====
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Response interceptor: auto refresh token on 401 =====
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // jodi 401 ashe ar eta already retry kora hoyni
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh_token");

      // refresh token o na thakle, sidha login page e pathiye dao
      if (!refreshToken) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        const newAccessToken = res.data.access;
        localStorage.setItem("access_token", newAccessToken);
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const loginUser = (username, password) =>
  axios.post(`${BASE_URL}/token/`, { username, password });

export const signupUser = (data) => api.post("/users/", data);
export const getMyProfile = () => api.get("/users/");


// nijer ekta record e ashbe
export const getAllUsers = () => api.get("/users/");
export const updateUser = (id, data) => api.patch(`/users/${id}/`, data);
export const deleteUser = (id) => api.delete(`/users/${id}/`);


export const getCategories = () => api.get("/categories/");
export const createCategory = (data) => api.post("/categories/", data);
export const updateCategory = (id, data) => api.patch(`/categories/${id}/`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}/`);


export const getCourses = () => api.get("/courses/");
export const getCourse = (id) => api.get(`/courses/${id}/`);
export const createCourse = (data) => api.post("/courses/", data);
export const updateCourse = (id, data) => api.patch(`/courses/${id}/`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}/`);


export const getLessons = (courseId) =>
api.get("/lessons/", { params: courseId ? { course: courseId } : {} });
export const getLesson = (id) => api.get(`/lessons/${id}/`);
export const createLesson = (data) => api.post("/lessons/", data);
export const updateLesson = (id, data) => api.patch(`/lessons/${id}/`, data);
export const deleteLesson = (id) => api.delete(`/lessons/${id}/`);


export const getEnrollments = () => api.get("/enrollments/");
export const enrollInCourse = (courseId) =>
  api.post("/enrollments/", { course: courseId });
export const unenroll = (enrollmentId) =>
  api.delete(`/enrollments/${enrollmentId}/`);


export const getProgress = () => api.get("/progress/");
export const markLessonComplete = (lessonId) =>
  api.post("/progress/", { lesson: lessonId, completed: true });
export const updateProgress = (id, data) => api.patch(`/progress/${id}/`, data);


export const getVideos = () => api.get("/videos/");
export const getVideo = (id) => api.get(`/videos/${id}/`);

export const getInstructors = () => api.get("/instructors/");
// export const getInstructor = (id) => api.get(`/instructors/${id}/`);




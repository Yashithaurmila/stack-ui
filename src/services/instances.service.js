
import http from "../http-comman";

class InstanceDataService {
  getAll() {
    return http.get("/instances");
  }


  get(id) {
    return http.get(`/instances/${id}`);
  }

  create(data) {
    return http.post("/instances", data);
  }

  update(id, data) {
    return http.put(`/instances/${id}`, data);
  }

  delete(id) {
    return http.delete(`/instances/${id}`);
  }

  deleteAll() {
    return http.delete(`/instances`);
  }

  findByName(name) {
    return http.get(`/instances?name=${name}`);
  }

  findByStatus(status) {
    return http.get(`/instances?status=${status}`);
  }
}

export default new InstanceDataService();
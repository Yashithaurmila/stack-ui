
import http from "../http-comman";

class EngineerDataService {
  getAll() {
    return http.get("/engineers");
  }


  get(engineerId) {
    return http.get(`/engineers/${engineerId}`);
  }

  create(data) {
    return http.post("/engineers", data);
  }


  update(engineerId, data) {
    return http.put(`/engineers/${engineerId}`, data);
  }

  delete(engineerId) {
    return http.delete(`/engineers/${engineerId}`);
  }

  deleteAll() {
    return http.delete(`/engineers`);
  }

  findByEngineerName(engineerName) {
    return http.get(`/engineers?=engineerName${engineerName}`);
  }


}

export default new EngineerDataService();
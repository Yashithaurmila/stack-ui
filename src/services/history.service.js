import http from "../http-comman";

class InstanceDataService {
  getAll(params) {
    if(params == null)
    return http.get(`/history`);
    else
    return http.get(`/history`, { params });
  }


  get(id) {
    return http.get(`/history/${id}`);
  }

  getAllByEngineerId(engineerId){
    return http.get(`/profile/${engineerId}`)
  }

  create(data, id){
    console.log(data);
    id = data.instanceId;
    console.log(id)
    return http.post(`/instances/${id}/assign`, data);
  }

  update(id, data) {
    return http.put(`/history/${id}`, data);
  }

  delete(id) {
    return http.delete(`/history/${id}`);
  }

  deleteAll() {
    return http.delete(`/history`);
  }

  findByInstanceId(instanceId) {
    return http.get(`/history?instanceId=${instanceId}`);
  }
}

export default new InstanceDataService();
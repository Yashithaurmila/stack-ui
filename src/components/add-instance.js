import React, { Component } from "react";
import InstanceDataService from "../services/instances.service"

export default class AddInstance extends Component {
  constructor(props) {
    super(props);
    this.onChangeId = this.onChangeId.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeTeamId = this.onChangeTeamId.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.saveInstance = this.saveInstance.bind(this);
    this.newInstance = this.newInstance.bind(this);
 
    this.state = {
      id:"",
      name: "",
      teamId: "", 
      status: "Free",

      submitted: false
    };
  }

  onChangeId(e) {
    this.setState({
      id: e.target.value
    });
  }
  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeTeamId(e) {
    this.setState({
      teamId: e.target.value
    });
  }
  onChangeStatus(e) {
    this.setState({
      status: e.target.value
    });
  }

  saveInstance() {
    var data = {
      id: this.state.id,
      name: this.state.name,
      teamId: this.state.teamId,
      status: this.state.status,
    };

    InstanceDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          teamId: response.data.teamId,
          status: response.data.status,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newInstance() {
    this.setState({
      id: "",
      name: "",
      teamId: "",
      status: "",

      submitted: false
    });
  }

  render() {
    return (
        <div className="submit-form">
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newInstance}>
                Add
              </button>
            </div>
          ) : (
            <div>
            <div className="form-group">
              <label htmlFor="id">Id</label>
              <input
                type="text"
                className="form-control"
                id="id"
                required
                value={this.state.id}
                onChange={this.onChangeId}
                name="id"
              />
            </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  value={this.state.name}
                  onChange={this.onChangeName}
                  name="name"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="teamId">TeamId</label>
                <input
                  type="text"
                  className="form-control"
                  id="teamId"
                  required
                  value={this.state.teamId}
                  onChange={this.onChangeTeamId}
                  name="teamId"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  type="text"
                  className="form-control"
                  id="status"
                  disabled="disabled"
                  value="Free"
                  onChange={this.onChangeStatus}
                  name="status"
                />
              </div>
  
              <button onClick={this.saveInstance} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      );
  }
}
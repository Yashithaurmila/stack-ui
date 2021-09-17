import React, { Component } from "react";
import HistoryDataService from "../services/history.service";

export default class AddInstance extends Component {
  constructor(props) {
    super(props);
    this.onChangeEngineerId = this.onChangeEngineerId.bind(this);
    this.onChangeEngineerName = this.onChangeEngineerName.bind(this);
    this.onChangeInstanceId = this.onChangeInstanceId.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveHistory = this.saveHistory.bind(this);
    this.newHistory = this.newHistory.bind(this);

    this.state = {
      engineerId:"",
      engineerName: "",
      instanceId: "", 
      desc:"",

      submitted: false
    };
  }

  onChangeEngineerId(e) {
    this.setState({
      EngineerId: e.target.value
    });
  }
  
  onChangeEngineerName(e) {
    this.setState({
      engineerName: e.target.value
    });
  }

  onChangeInstanceId(e) {
    this.setState({
      instanceId: e.target.value
    });
  }
  onChangeDescription(e) {
    this.setState({
      desc: e.target.value
    });
  }

  saveHistory() {
    var data = {
      engineerId: this.state.engineerId,
      engineerName: this.state.engineerName,
      instanceId: this.state.instanceId,
      desc: this.state.desc
    };

    HistoryDataService.create(data)
      .then(response => {
        this.setState({
          engineerId: response.data.engineerId,
          engineerName: response.data.engineerName,
          instanceId: response.data.instanceId,
          desc: response.data.desc,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newHistory() {
    this.setState({
      engineerId: "",
      engineerName: "",
      instanceId: "",
      desc: "",

      submitted: false
    });
  }

  render() {
    return (
        <div className="submit-form">
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newHistory}>
                Add
              </button>
            </div>
          ) : (
            <div>
            <div className="form-group">
              <label htmlFor="engineerId">EngineerId</label>
              <input
                type="text"
                className="form-control"
                id="engineerId"
                required
                value={this.state.engineerId}
                onChange={this.onChangeEngineerId}
                name="engineerId"
              />
            </div>
              <div className="form-group">
                <label htmlFor="engineerName">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="enginnerName"
                  required
                  value={this.state.engineerName}
                  onChange={this.onChangeEngineerName}
                  name="name"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="instanceId">InstanceId</label>
                <input
                  type="text"
                  className="form-control"
                  id="instanceId"
                  required
                  value={this.state.instanceId}
                  onChange={this.onChangeInstanceId}
                  name="instanceId"
                />
              </div>

              <div className="form-group">
                <label htmlFor="desc">Description</label>
                <textarea
                 className="form-control"
                 id="desc"
                 required
                 value={this.state.desc}
                 onChange={this.onChangeDescription}
                 name="desc"
                 >
                    </textarea>
             
              </div>
  
              <button onClick={this.saveHistory} className="btn btn-success gap" >
                Submit
              </button>
            </div>
          )}
        </div>
      );
  }
}
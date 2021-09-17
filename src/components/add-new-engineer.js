import React, { Component } from "react";
import EngineerDataService from "../services/engineers.service"

export default class AddEngineer extends Component {
  constructor(props) {

    super(props);
    this.onChangeId = this.onChangeId.bind(this);
    this.onChangeEngineerId = this.onChangeEngineerId.bind(this);
    this.onChangeEngineerName = this.onChangeEngineerName()
    this.saveEngineer = this.saveEngineer.bind(this);
    this.newEngineer = this.newEngineer.bind(this);
 
    this.state = {

      id:"",
      engineerId:"",
      engineerName: "",


      submitted: false
    };
  }

  onChangeId(e) {
    this.setState({
      id: e.target.value
    });
  }

  onChangeEngineerId(e) {
    this.setState({
      engineerId: e.target.value
    });
  }
  onChangeEngineerName(e) {
    this.setState({
      engineerName: e.target.value
    });
  }


  saveEngineer() {
    var data = {
      id: this.state.id,
      engineerId: this.state.engineerId,
      engineerName: this.state.engineerName,

    };

    EngineerDataService.create(data)
      .then(response => {
        this.setState({
          id:response.data.id,
          engineerId: response.data.engineerId,
          engineerName: response.data.engineerName,


          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newEngineer() {
    this.setState({
      id:"",
      engineerId: "",
      engineerName: "",


      submitted: false
    });
  }

  render() {
    return (
        <div className="submit-form">
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newEngineer}>
                Add
              </button>
            </div>
          ) : (
            <div>
            <div className="form-group">
              <label htmlFor="engineerId">Id</label>
              <input
                type="text"
                className="form-control"
                id="engineerId"
                required
                value={this.state.engineerId}
                onChange={this.onChangeEngineerId}
                name="id"
              />
            </div>
              <div className="form-group">
                <label htmlFor="engineerName">engineerName</label>
                <input
                  type="text"
                  className="form-control"
                  id="engineerName"
                  required
                  value={this.state.engineerName}
                  onChange={this.onChangeEngineerName}
                  name="engineerName"
                />
              </div>
  

  
              <button onClick={this.saveEngineer} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      );
  }
}
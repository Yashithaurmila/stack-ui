import React, { Component } from "react";
import HistoryDataService from "../services/history.service";
import InstanceDataService from "../services/instances.service";

export default class AssignEngineer extends Component{

    constructor(props) {
        super(props);

        this.onChangeEngineerId = this.onChangeEngineerId.bind(this);
        this.onChangeEngineerName = this.onChangeEngineerName.bind(this);
        this.onChangeInstanceId = this.onChangeInstanceId.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.saveHistory = this.saveHistory.bind(this);
        this.newHistory = this.newHistory.bind(this);

        this.state = {

            currentInstance: {
                id: "",
                status: ""
            },

            engineerId:"",
            engineerName: "",
            instanceId: "",
            desc:"",

            submitted: false
        };
    }

    componentDidMount() {
        this.getInstance(this.props.match.params.id);
    }

    getInstance(id) {
        InstanceDataService.get(id)
            .then(response => {
                this.setState({
                    currentInstance: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
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

    onChangeInstanceId(e) {
        this.setState({
            instanceId: this.state.currentInstance.id
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
            instanceId: this.state.currentInstance.id,
            desc: this.state.desc
        };

        HistoryDataService.create(data)
            .then(response => {
                this.setState({
                    engineerId: response.data.engineerId,
                    engineerName: response.data.engineerName,
                    instanceId: this.state.currentInstance.id,
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
            instanceId: this.state.currentInstance.id,
            desc: "",

            submitted: false
        });
    }
    render() {
        const { currentInstance } = this.state;

        return (
            <div className="submit-form">
                {this.state.submitted ? (
                    <div>
                        <h4>You submitted successfully!</h4>

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
                                disabled="disabled"
                                value={this.state.currentInstance.id}
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
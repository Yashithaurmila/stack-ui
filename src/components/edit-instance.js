import React, { Component } from "react";
import InstanceDataService from "../services/instances.service";

export default class EditInstance extends Component {
    constructor(props) {
        super(props);
        this.onChangeId =this.onChangeId.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeTeamId = this.onChangeTeamId.bind(this);
        this.onChanngeStatus = this.onChangeStatus.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.updateInstance = this.updateInstance.bind(this);
        this.deleteInstance = this.deleteInstance.bind(this);

        this.state = {
            currentInstance: {
                id: "",
                name: "",
                teamId: "",
                status: ""
            },
            message: ""
        };
    }

    componentDidMount() {
        this.getInstance(this.props.match.params.id);
    }

    onChangeId(e) {
        const id = e.target.value;

        this.setState(function(prevState) {
            return {
                currentInstance: {
                    ...prevState.currentInstance,
                    id: id
                }
            };
        });
    }
    onChangeName(e) {
        const name = e.target.value;

        this.setState(function(prevState) {
            return {
                currentInstance: {
                    ...prevState.currentInstance,
                    name: name
                }
            };
        });
    }

    onChangeTeamId(e) {
        const teamId = e.target.value;

        this.setState(function(prevState){
            return {
                currentInstance: {
                    ...prevState.currentInstance,
                    teamId: teamId
                }
            };
        });
    }

    onChangeStatus(e) {
        const status = e.target.value;

        this.setState(function(prevState){
            return {
                currentInstance: {
                    ...prevState.currentInstance,
                    status: status
                }
            };
        });
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

    updateStatus(status) {
        var data = {
            id: this.state.currentInstance.id,
            name: this.state.currentInstance.name,
            teamId: this.state.currentInstance.teamId,
            status: status
        };

        InstanceDataService.update(this.state.currentInstance.id, data)
            .then(response => {
                this.setState(prevState => ({
                    currentInstance: {
                        ...prevState.currentInstance,
                        status: status
                    }
                }));
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateInstance() {
        InstanceDataService.update(
            this.state.currentInstance.id,
            this.state.currentInstance
        )
            .then(response => {
                console.log(response.data);
                this.setState({
                    message: "The instance was updated successfully!"
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    deleteInstance() {
        InstanceDataService.delete(this.state.currentInstance.id)
            .then(response => {
                console.log(response.data);
                this.props.history.push('/instances')
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { currentInstance } = this.state;

        return (
            <div>
                {currentInstance ? (
                    <div className="edit-form">
                        <h4>Instance</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="id">Id</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="id"
                                    disabled="disabled"
                                    value={currentInstance.id}
                                    onChange={this.onChangeId}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" >Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={currentInstance.name}
                                    onChange={this.onChangeName}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="teamid" >TeamId</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="teamId"
                                    value={currentInstance.teamId}
                                    onChange={this.onChangeTeamId}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <strong>Status:</strong>
                                </label>
                                {currentInstance.status}
                            </div>
                        </form>

                        {currentInstance.status==="Free"? (
                            <button
                                className="btn btn-primary mx-1"
                                onClick={() => this.updateStatus("InUse")}
                            >
                                InUse
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary mx-1"
                                onClick={() => this.updateStatus("Free")}
                            >
                                Free
                            </button>
                        )}

                        <button
                            className="btn btn-danger mx-2"
                            onClick={this.deleteInstance}
                        >
                            Delete
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.updateInstance}
                        >
                            Update
                        </button>
                        <p>{this.state.message}</p>

                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Please click on a Instance...</p>
                    </div>
                )}
            </div>
        );

    }
}
import React, { Component } from "react";
import InstanceDataService from "../services/instances.service"
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";

export default class ViewInstance extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.onChangeSearchStatus = this.onChangeSearchStatus.bind(this);
    this.retrieveInstances = this.retrieveInstances.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveInstance = this.setActiveInstance.bind(this);
    this.removeAllInstances = this.removeAllInstances.bind(this);
    this.searchName = this.searchName.bind(this);
    this.searchStatus = this.searchStatus.bind(this);
    this.deleteInstance = this.deleteInstance.bind(this);
    this.updateInstance = this.updateInstance.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      instances: [],
      currentInstance: null,
      currentIndex: -1,
      searchName: "",
      searchStatus: "",

        showUpdateInstance:false,
        currentUser: undefined,
    };
  }

  componentDidMount() {
      const user = AuthService.getCurrentUser();

      if (user) {
          this.setState({
              currentUser: user,

              showUpdateInstance: user.roles.includes("ROLE_ADMIN")
          });
      }

      EventBus.on("logout", () => {
          this.logOut();
      });
    this.retrieveInstances();
  }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        AuthService.logout();
        this.setState({
            showUpdateInstance: false,

        });
    }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }
  onChangeSearchStatus(e) {
    const searchStatus = e.target.value;

    this.setState({
      searchStatus: searchStatus
    });
  }
  retrieveInstances() {
    InstanceDataService.getAll()
        .then(response => {
          this.setState({
            instances: response.data
          });
          console.log(response.data);
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
  updateInstance() {
    InstanceDataService.update(this.state.currentInstance.id)
        .then(response => {
          console.log(response.data);
          this.props.history.push('/instances')
        })
        .catch(e => {
          console.log(e);
        });
  }


  refreshList() {
    this.retrieveInstances();
    this.setState({
      currentInstance: null,
      currentIndex: -1
    });
  }

  setActiveInstance(instance, index) {
    this.setState({
      currentInstance: instance,
      currentIndex: index
    });
  }

  removeAllInstances() {
    InstanceDataService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
  }

  searchName() {
    InstanceDataService.findByName(this.state.searchName)
        .then(response => {
          this.setState({
            instances: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }

  searchStatus() {
    InstanceDataService.findByStatus(this.state.searchStatus)
        .then(response => {
          this.setState({
            instances: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }

  render() {
    const { searchName, instances, currentInstance, currentIndex, currentUser, showUpdateInstance} = this.state;

    return (
        <div className="list row">
          <div className="col-md-8">
            <div className="input-group mb-3">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name"
                  value={searchName}
                  onChange={this.onChangeSearchName}
              />
              <div className="input-group-append">
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.searchName}
                >
                  Search
                </button>
              </div>
            </div>

          </div>
          <div className="col-md-6">
            <h4>Instances List</h4>

            <ul className="list-group">
              {instances &&
              instances.map((instance, index) => (
                  <li
                      className={
                        "list-group-item " +
                        (index === currentIndex ? "active" : "")
                      }
                      onClick={() => this.setActiveInstance(instance, index)}
                      key={index}
                  >
                    {instance.name} = {instance.status}
                  </li>
              ))}
            </ul>

              {showUpdateInstance && (

                  <button
                      className="m-3 btn btn-sm btn-danger"
                      onClick={this.removeAllInstances}
                  >
                      Remove All
                  </button>
              )}
          </div>
          <div className="col-md-6">
            {currentInstance ? (
                <div>
                  <h4>Instance</h4>
                  <div>
                    <label>
                      <strong>Id:</strong>
                    </label>{" "}
                    {currentInstance.id}
                  </div>
                  <div>
                    <label>
                      <strong>Name:</strong>
                    </label>{" "}
                    {currentInstance.name}
                  </div>
                  <div>
                    <label>
                      <strong>TeamId:</strong>
                    </label>{" "}
                    {currentInstance.teamId}
                  </div>
                  <div>
                    <label disabled>
                      <strong>Status:</strong>
                    </label>{" "}
                    {currentInstance.status}
                  </div>

                    {showUpdateInstance && (
                        <button className="btn btn-primary mx-2">
                            <Link
                                to={"/login-engineer/" + currentInstance.id}
                                className="badge badge-primary"
                            >
                                Update
                            </Link>
                        </button>
                    )}

                    {currentInstance.status==="Free"? (
                            <button className="btn btn-primary mx-2">
                                <Link
                                    to={`/instances/${currentInstance.id}/assign`}
                                    className="badge badge-primary"
                                >
                                    Assign
                                </Link>
                            </button>
                    ) : (
                       <h1></h1>
                    )}


                </div>

            ) : (
                <div>
                  <br />
                  <p>Please click on a Instance...</p>
                </div>
            )}
          </div>
        </div>
    );
  }
}
import React, { Component } from "react";
import EngineerDataService from "../services/engineers.service"
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";

export default class ViewEngineer extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchEngineerName = this.onChangeSearchEngineerName.bind(this);
    this.retrieveEngineers = this.retrieveEngineers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveEngineer = this.setActiveEngineer.bind(this);
    this.removeAllEngineers = this.removeAllEngineers.bind(this);
    this.searchEngineerName = this.searchEngineerName.bind(this);

    this.deleteEngineer = this.deleteEngineer.bind(this);
    this.updateEngineer = this.updateEngineer.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      Engineers: [],
      currentEngineer: null,
      currentIndex: -1,
      searchEngineerName: "",
        showUpdateEngineer:false,
        currentUser: undefined,
        showRemoveBoard:false
    };
  }

  componentDidMount() {
      const user = AuthService.getCurrentUser();

      if (user) {
          this.setState({
              currentUser: user,
              showRemoveBoard: user.roles.includes("ROLE_ADMIN"),
              showUpdateEngineer: user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_MODERATOR")
          });
      }

      EventBus.on("logout", () => {
          this.logOut();
      });
    this.retrieveEngineers();
  }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        AuthService.logout();
        this.setState({
            showUpdateEngineer: false,
            showRemoveBoard:false
        });
    }

  onChangeSearchEngineerName(e) {
    const searchEngineerName = e.target.value;


    this.setState({

      searchEngineerName: searchEngineerName
    });
    console.log(searchEngineerName);
  }

  retrieveEngineers() {
    EngineerDataService.getAll()
        .then(response => {
          this.setState({
            engineers: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }

  deleteEngineer() {
    EngineerDataService.delete(this.state.currentEngineer.engineerId)
        .then(response => {
          console.log(response.data);
          this.props.history.push('/engineers')
        })
        .catch(e => {
          console.log(e);
        });
  }
  updateEngineer() {
    EngineerDataService.update(this.state.currentEngineer.engineerId)
        .then(response => {
          console.log(response.data);
          this.props.history.push('/engineers')
        })
        .catch(e => {
          console.log(e);
        });
  }


  refreshList() {
    this.retrieveEngineers();
    this.setState({
      currentEngineer: null,
      currentIndex: -1
    });
  }

  setActiveEngineer(engineer, index) {
    this.setState({
      currentEngineer: engineer,
      currentIndex: index
    });
  }

  removeAllEngineers() {
    EngineerDataService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
  }

  searchEngineerName() {
    EngineerDataService.findByEngineerName(this.state.searchEngineerName)
        .then(response => {
          this.setState({
            engineers: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }



  render() {
    const { searchEngineerName, engineers, currentEngineer, currentIndex, currentUser, showUpdateEngineer, showRemoveBoard} = this.state;

    return (
        <div className="list row">
          <div className="col-md-8">
            <div className="input-group mb-3">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Search by engineername"
                  value={searchEngineerName}
                  onChange={this.onChangeSearchEngineerName}
              />
              <div className="input-group-append">
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.searchEngineerName}
                >
                  Search
                </button>
              </div>
            </div>

          </div>
          <div className="col-md-6">
            <h4>Engineers List</h4>

            <ul className="list-group">
              {engineers &&
              engineers.map((engineer, index) => (
                  <li
                      className={
                        "list-group-item " +
                        (index === currentIndex ? "active" : "")
                      }
                      onClick={() => this.setActiveEngineer(engineer, index)}
                      key={index}
                  >
                    {engineer.engineerName}
                  </li>
              ))}
            </ul>

              {showRemoveBoard && (

                  <button
                      className="m-3 btn btn-sm btn-danger"
                      onClick={this.removeAllEngineers}
                  >
                      Remove All
                  </button>
              )}
              {showRemoveBoard && (


                  <button className="m-3 btn btn-sm btn-primary">

                      <Link
                          to={`/engineers/add`}
                          className="badge badge-primary"
                      >
                          AddEngineer
                      </Link>
                  </button>
              )}
          </div>
          <div className="col-md-6">
            {currentEngineer ? (
                <div>
                  <h4>Engineer</h4>
                  <div>
                    <label>
                      <strong>EngineerID</strong>
                    </label>{" "}
                    {currentEngineer.engineerId}
                  </div>
                  <div>
                    <label>
                      <strong>Name</strong>
                    </label>{" "}
                    {currentEngineer.engineerName}
                  </div>


                    {showUpdateEngineer && (
                        <button className="btn btn-primary mx-2">
                            <Link
                                to={"/engineers/" + currentEngineer.engineerId}
                                className="badge badge-primary"
                            >
                                Update
                            </Link>
                        </button>
                    )}

                </div>

            ) : (
                <div>
                  <br />
                  <p>Please click on a Engineer...</p>
                </div>
            )}
          </div>
        </div>
    );
  }
}
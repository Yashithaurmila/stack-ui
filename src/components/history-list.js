import React, { Component } from "react";
import HistoryDataService from "../services/history.service";
import Pagination from "@material-ui/lab/Pagination";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";

export default class HistorysList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchInstanceId = this.onChangeSearchInstanceId.bind(this);
    this.retrieveHistorys = this.retrieveHistorys.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveHistory = this.setActiveHistory.bind(this);
    this.removeAllHistorys = this.removeAllHistorys.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.deleteHistory = this.deleteHistory.bind(this);
    this.state = {
      historys: [],
      currentHistory: null,
      currentIndex: -1,
      searchInstanceId: "",
      showRemoveHistory : false,

      page: 1,
      count: 0,
      pageSize: 3,
    };

    this.pageSizes = [10, 20, 30, 40, 50, 60];
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showRemoveHistory: user.roles.includes("ROLE_ADMIN" ) ,

      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
    this.retrieveHistorys();
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showRemoveHistory: false,


    });
  }

  onChangeSearchInstanceId(e) {
    const searchInstanceId = e.target.value;

    this.setState({
      searchInstanceId: searchInstanceId,
    });
  }

  setActiveHistory(history, index) {
    this.setState({
      currentHistory: history,
      currentIndex: index
    });
  }
  refreshList() {
    this.retrieveHistorys();
    this.setState({
      currentHistory: null,
      currentIndex: -1
    });
  }

  deleteHistory() {
    HistoryDataService.delete(this.state.currentHistory.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/history')
      })
      .catch(e => {
        console.log(e);
      });
  }

  removeAllHistorys() {
    HistoryDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  getRequestParams(searchInstanceId, page, pageSize) {
    let params = {};

    if (searchInstanceId) {
      params["instanceId"] = searchInstanceId;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  }

  retrieveHistorys() {
    const { searchInstanceId, page, pageSize } = this.state;
    const params = this.getRequestParams(searchInstanceId, page, pageSize);

    HistoryDataService.getAll(params)
      .then((response) => {
        const { historys, totalPages } = response.data;

        this.setState({
          historys: historys,
          count: totalPages,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }



  handlePageChange(event, value) {
    this.setState(
      {
        page: value,
      },
      () => {
        this.retrieveHistorys();
      }
    );
  }

  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1
      },
      () => {
        this.retrieveHistorys();
      }
    );
  }

  render() {
    const {
      searchInstanceId,
      historys,
      currentHistory,
      currentIndex,
      page,
      count,
      pageSize,
        showRemoveHistory
    } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by instance id"
              value={searchInstanceId}
              onChange={this.onChangeSearchInstanceId}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.retrieveHistorys}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Historys List</h4>

          <div className="mt-3">
            {"Items per Page: "}
            <select onChange={this.handlePageSizeChange} value={pageSize}>
              {this.pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={this.handlePageChange}
            />
          </div>

          <ul className="list-group">
            {historys &&
              historys.map((history, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveHistory(history, index)}
                  key={index}
                >
                  {history.engineerName}
                </li>
              ))}
          </ul>

          {showRemoveHistory && (
              <button
                  className="m-3 btn btn-sm btn-danger"
                  onClick={this.removeAllHistorys}
              >
                Remove All
              </button>
          )}

        </div>
        <div className="col-md-6">
          {currentHistory ? (
            <div>
              <h4>History</h4>
              <div>
                <label>
                  <strong>EngineerId</strong>
                </label>{" "}
                {currentHistory.engineerId}
              </div>
              <div>
                <label>
                  <strong>Engineer Name:</strong>
                </label>{" "}
                {currentHistory.engineerName}
              </div>
              <div>
                <label>
                  <strong>InstanceId:</strong>
                </label>{" "}
                {currentHistory.instanceId}
              </div>
              <div>
                <label>
                  <strong>CreationTime</strong>
                </label>{" "}
                {currentHistory.time}
              </div>

              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentHistory.desc}
              </div>

            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a history item.........</p>
            </div>
          )}

        </div>


      </div>
    );
  }
}

import React, { Component } from "react";
import HistoryDataService from "../services/history.service";
import Pagination from "@material-ui/lab/Pagination";
import { Dropdown,  DropdownButton } from "react-bootstrap";
//import { Link } from "react-router-dom";
export default class ViewHistory extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchId = this.onChangeSearchId.bind(this);
        this.retrieveHistorys = this.retrieveHistorys.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveHistory = this.setActiveHistory.bind(this);
        this.removeAllHistorys = this.removeAllHistorys.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.state = {
            historys: [],
            currentHistory: null,
            currentIndex: -1,
            searchId: "",
            page: 1,
            count: 0,
            pageSize: 10,
        };
        this.pageSizes = [10,20,30, 40, 50];
    }
    componentDidMount() {
        this.retrieveHistorys();
    }
    onChangeSearchId(e) {
        const searchId = e;
        this.setState({
            searchId: searchId,
        });
        this.retrieveHistorys();
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
    getRequestParams(searchId, page, pageSize) {
        let params = {};
        if (searchId) {
            params["instanceId"] = searchId;
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
        const { searchId, page, pageSize } = this.state;
        const params = this.getRequestParams(searchId, page, pageSize);
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
            //  searchId,
            historys,
            //currentHistory,
            //currentIndex,
            page,
            count,
            pageSize,
        } = this.state;
        return (
            <div className="list row">
                <div className="col-md-8">
                    <DropdownButton id="dropdown-basic-button" variant="secondary" title="Select Instance Id">
                        <Dropdown.Item ><button class="btn" value="1"
                                                onClick={e => this.onChangeSearchId(e.target.value)}>1</button></Dropdown.Item>
                        <Dropdown.Item ><button class="btn" value="2"
                                                onClick={e => this.onChangeSearchId(e.target.value)}>2</button></Dropdown.Item>
                        <Dropdown.Item ><button class="btn" value="3"
                                                onClick={e => this.onChangeSearchId(e.target.value)}>3</button></Dropdown.Item>
                        <Dropdown.Item ><button class="btn" value="4"
                                                onClick={e => this.onChangeSearchId(e.target.value)}>4</button></Dropdown.Item>
                        <Dropdown.Item ><button class="btn" value="5"
                                                onClick={e => this.onChangeSearchId(e.target.value)}>5</button></Dropdown.Item>
                    </DropdownButton>

                    {/* <div className=“input-group mb-3”>
            <input
              type=“text”
              className=“form-control”
              placeholder=“Search by instance id”
              value={searchInstanceId}
              onChange={this.onChangeSearchInstanceId}
            />
            <div className=“input-group-append”>
              <button
                className=“btn btn-outline-secondary”
                type=“button”
                onClick={this.retrieveHistorys}
              >
                Search
              </button>
            </div>
          </div> */}
                </div>
                <div className="col-md-6">
                    <br/>
                    <h4>History</h4>
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
                    {/* <ul className=“list-group”>
            {historys &&
              historys.map((history, index) => (
                <li
                  className={
                    “list-group-item ” +
                    (index === currentIndex ? “active” : “”)
                  }
                  onClick={() => this.setActiveHistory(history, index)}
                  key={index}
                >
                  {history.empId}
                </li>
              ))}
          </ul>
          <button
            className=“m-3 btn btn-sm btn-danger”
            onClick={this.removeAllHistorys}
          >
            Remove All
          </button> */}
                    <table class="table table-hover table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">InstanceId</th>
                            <th scope="col">InstanceName</th>
                            <th scope="col">EmpId</th>
                            <th scope="col">Purpose</th>
                        </tr>
                        </thead>
                        <tbody>
                        {historys &&
                        historys.map ((history,index) => (
                            <tr>
                                <td>{history.id}</td>
                                <td>{history.name}</td>
                                <td>{history.empId}</td>
                                <td>{history.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {/* <div className=“col-md-6">
          {currentHistory ? (
            <div>
              <h4>History</h4>
              <div>
                <label>
                  <strong>Id:</strong>
                </label>{” “}
                {currentHistory.id}
              </div>
              <div>
                <label>
                  <strong>Instance Name:</strong>
                </label>{” “}
                {currentHistory.name}
              </div>
              <div>
                <label>
                  <strong>EmployeeId:</strong>
                </label>{” “}
                {currentHistory.empId}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{” “}
                {currentHistory.description}
              </div>
              <button className=“btn btn-sm btn-warning”>
              <Link
                to={“/history/” + currentHistory.id}
                className=“badge badge-warning”
              >
                Edit
              </Link>
              </button>
            </div>
           ) : (
            <div>
              <br />
              <p>Please click on a Instance...</p>
            </div>
          )} */}
                {/* </div> */}
            </div>
        );
    }
}
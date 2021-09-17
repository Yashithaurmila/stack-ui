import React, { Component } from "react";
import InstanceDataService from "../services/instances.service"
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import HistoryDataService from "../services/history.service"

import {Row, Col, Container} from "react-bootstrap"
export  default  class ViewEngineerHistory extends Component {

    constructor(props) {
        super(props);

        this.retrieveHistoriesByEngineerId = this.retrieveHistoriesByEngineerId.bind(this);
        this.setActiveHistory = this.setActiveHistory.bind(this);
        this.disableInstance = this.disableInstance.bind(this);

        this.state = {
            histories: [],
            currentHistory: null,
            currentIndex: -1,
            currentInstance: null
        }
    }

    setActiveHistory(history, index) {
        this.setState({
            currentHistory: history,
            currentIndex: index
        });
    }

    componentDidMount() {
        console.log(this.props.match.params.engineerId)
        this.retrieveHistoriesByEngineerId(this.props.match.params.engineerId);
    }

    disableInstance() {
        console.log(this.state.currentHistory.id)
        HistoryDataService.delete(this.state.currentHistory.id)
            .then(response => {
                console.log(response.data);
                this.props.history.push(`/profile`)
            })
            .catch(e => {
                console.log(e);
            });
    }

    retrieveHistoriesByEngineerId(engineerId) {
        HistoryDataService.getAllByEngineerId(engineerId)

            .then(response => {
                this.setState(
                    {
                        histories: response.data
                    }
                );
                console.log(response.data)
            })
            .catch(e => {
                console.log(e)
            })

    }

    render() {
        const {histories, currentIndex, currentHistory} = this.state;
        return (
            <div className="list row">
                <div className="col-md-6">
                    <h4>Historys List</h4>

                    <ul className="list-group">
                        {histories &&
                        histories.map((history, index) => (
                            <li
                                className={
                                    "list-group-item " +
                                    (index === currentIndex ? "active" : "")
                                }
                                onClick={() => this.setActiveHistory(history, index)}
                                key={index}
                            >
                                {history.time}
                            </li>
                        ))}
                    </ul>
                </div>
                   <div className={"col-md-6"}>
                       {
                           currentHistory ? (
                               <div>
                                   <h4>History</h4>
                                   <div>
                                       <label>
                                           <strong>Assigned Instance</strong>
                                       </label>{" "}
                                       {currentHistory.instanceId}
                                   </div>
                                   <div>
                                       <label>
                                           <strong>Creation time</strong>
                                       </label>{" "}
                                       {currentHistory.time}
                                   </div>
                                   <div>
                                       {currentHistory.lifeTime === 0 ?(
                                           <div>
                                               <button
                                                   className="btn btn-danger mx-2"
                                                   onClick={this.disableInstance}
                                               >
                                                   Disable
                                               </button>
                                           </div>
                                       ):(
                                           <div>
                                               <label>
                                                   <strong>life Time</strong>
                                               </label>{" "}
                                               {currentHistory.lifeTime}
                                           </div>
                                       )}
                                   </div>
                               </div>

                           ) :(

                                   <div>
                                       <br />
                                       <p>Please click on a History item...</p>
                                   </div>

                           )
                       }
                   </div>

            </div>
        );
    }




}
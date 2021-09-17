import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddEngineer from "./components/assign-enginner"

import "./App.css";

import AddNewEngineer from "./components/add-new-engineer"
import AuthService from "./services/auth.service";
import EditHistory from "./components/edit-history";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import ViewInstance from "./components/view-instance";
import EditInstance from "./components/edit-instance";
import HistorysList from "./components/history-list";
import AssignEngineer from "./components/add-history";
import ViewEngineer from "./components/view-engineer";
import ViewEngineerHistory from "./components/view-engineer-history";
// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";
import AddInstance from "./components/add-instance";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      showAssignEngineer: false,
      showAddInstance:false,
      showEngineerBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
        showAddInstance:user.roles.includes("ROLE_ADMIN"),
        showInstanceBoard: user.roles.includes("ROLE_USER"),
        showAssignEngineer: user.roles.includes("ROLE_ADMIN"),
        showHistoryBoard: user.roles.includes("ROLE_ADMIN" ) ,
        showEngineerBoard: user.roles.includes("ROLE_USER")

      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAddInstance:false,
      showAdminBoard: false,
      showInstanceBoard: false,
      showEngineerBoard: false,
      showHistoryBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAssignEngineer, showInstanceBoard, showAddInstance, showHistoryBoard, showEngineerBoard} = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-primary" >
          <Link to={"/"} className="navbar-brand">
            Freshworks
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>



            {showInstanceBoard && (
                <li className="nav-item">
                  <Link to={"/instances"} className="nav-link">
                    instances
                  </Link>
                </li>
            )}

            {showEngineerBoard && (
                <li className="nav-item">
                  <Link to={"/engineers"} className="nav-link">
                    engineers
                  </Link>
                </li>
            )}

            {showAddInstance && (
                <li className="nav-item">
                  <Link to={"/add"} className="nav-link">
                    add
                  </Link>
                </li>
            )}

            {showHistoryBoard && (
                <li className="nav-item">
                  <Link to={"/history"} className="nav-link">
                    history
                  </Link>
                </li>
            )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto topright">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li>
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="topright navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item ">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path={["/profile"]} component={Profile} />
            <Route  exact path={["/instances"]} component={ViewInstance} />
            <Route path="/add" component={AddInstance} />
            <Route exact path={["/history"]} component={HistorysList}/>
            <Route exact path={["/engineers"]} component={ViewEngineer}/>
            <Route exact path={["/login-engineer/:id"]} component={EditInstance} />
            <Route path="/instances/:id/assign" component={AddEngineer}/>

            <Route path="/history/:id" component={EditHistory} />
            <Route path="/profile/:engineerId" component={ViewEngineerHistory}/>
            <Route exact path={["/engineers"]} component={ViewEngineer}/>
            <Route exact path={["/engineers/add"]} component={AddNewEngineer}/>
          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}

export default App;

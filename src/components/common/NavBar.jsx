import React, { Component } from 'react';
import {Row, Col, Sidenav, Icon, Navbar, Nav} from "rsuite";
import { Link } from 'react-router-dom';
import AuthService from "../../services/Auth";

let auth = new AuthService();

class NavbarComponent extends Component {
  render() { 
    return (
      <Navbar appearance="inverse">
      <Navbar.Body>
        <Row>
          <Col md={4} mdOffset={10}>
            <Nav>
              <Nav.Item icon={<Icon icon="home" size="lg"/>} >CMS</Nav.Item>
            </Nav>
          </Col>
          <Col>
            <Nav pullRight>
              {
                AuthService.isSignedIn() && 
                <Link to="/">
                  <Nav.Item onClick={() => auth.signOut()} icon={<Icon icon="sign-out" size="lg"/>}>Logout</Nav.Item>
                </Link>
              }
            </Nav>
          </Col>
        </Row>
      </Navbar.Body>
    </Navbar>
    )
  }

}

class NavSideBarComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: true,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }
  handleToggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const {expanded} = this.state;
    return (
      <div style={{ width: 200 }}>
        <Sidenav
          expanded={expanded}
          activeKey={this.props.activeKey}
        >
          <Sidenav.Body>
            <Nav>
              <Nav.Item onClick={this.handleToggle} icon={<Icon icon="bars" />}>CMS</Nav.Item>
              <Link to="/">
                <Nav.Item eventKey="1" icon={<Icon icon="dashboard" />}>
                  Dashboard
                </Nav.Item>
              </Link>
              <Link to="/applicants">
                <Nav.Item eventKey="2" icon={<Icon icon="group" />}>
                  Applicants
                </Nav.Item>
              </Link>
              <Link to="/services">
                <Nav.Item eventKey="3" icon={<Icon icon="gear-circle" />}>
                  Services
                </Nav.Item>
              </Link>
              <Link to="/jobs">
                <Nav.Item eventKey="4" icon={<Icon icon="handshake-o" />}>
                  Jobs
                </Nav.Item>
              </Link>
              <Link to="/general-questions">
                <Nav.Item eventKey="7" icon={<Icon icon="question-circle2" />}>
                  General Questions
                </Nav.Item>
              </Link>
              <Link to="/tests">
                <Nav.Item eventKey="5" icon={<Icon icon="book2" />}>
                  Service Tests
                </Nav.Item>
              </Link>
              <Link to="/interviews">
                <Nav.Item eventKey="6" icon={<Icon icon="briefcase" />}>
                  Interviews
                </Nav.Item>
              </Link>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
    );
  }
}



export {NavbarComponent, NavSideBarComponent};

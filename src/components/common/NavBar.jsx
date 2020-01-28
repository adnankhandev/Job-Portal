import React, { Component } from 'react';
import {Sidenav, Icon, Dropdown, Navbar, Nav} from "rsuite";

import AuthService from "../../services/Auth";
import Auth from '../../stores/Auth';

let auth=new AuthService();

class NavbarComponent extends Component {
  constructor () {
    super();
    this.signOut = this.signOut.bind(this);
  }
  signOut () {
    auth.signOut();
    this.props.history.push("/");
  }

  render() { 
    return (
      <Navbar appearance="inverse">
      <Navbar.Body>
        <Nav>
          <Nav.Item icon={<Icon icon="home" size="lg"/>} >CMS</Nav.Item>
          <Dropdown title="About">
            <Dropdown.Item>Company</Dropdown.Item>
            <Dropdown.Item>Team</Dropdown.Item>
            <Dropdown.Item>Contact</Dropdown.Item>
          </Dropdown>
        </Nav>
        <Nav pullRight>
          <Nav.Item onClick={() => this.signOut()} icon={<Icon icon="sign-out" size="lg"/>}>Logout</Nav.Item>
        </Nav>
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
      activeKey: '1'
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleToggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }
  render() {
    const { expanded } = this.state;

    return (
      <div style={{ width: 250 }}>
        <Sidenav
          expanded={expanded}
          defaultOpenKeys={['3', '4']}
          activeKey={this.state.activeKey}
          onSelect={this.handleSelect}
        >
          <Sidenav.Body>
            <Nav>
              <Nav.Item onClick={this.handleToggle} icon={<Icon icon="bars" />} >CMS</Nav.Item>
              <Nav.Item eventKey="1" icon={<Icon icon="dashboard" />}>
                Dashboard
              </Nav.Item>
              <Nav.Item eventKey="2" icon={<Icon icon="group" />}>
                Applicants
              </Nav.Item>
              <Dropdown
                placement="rightStart"
                eventKey="3"
                title="Services"
                icon={<Icon icon="gear-circle" />}
              >
                <Dropdown.Item eventKey="3-1" icon={<Icon icon="list-ul" />}>View all</Dropdown.Item>
                <Dropdown.Item eventKey="3-2" icon={<Icon icon="plus" />}>Create new</Dropdown.Item>
              </Dropdown>
              <Dropdown
                placement="rightStart"
                eventKey="4"
                title="Jobs"
                icon={<Icon icon="black-tie" />}
              >
                <Dropdown.Item eventKey="4-1" icon={<Icon icon="list-ul" />}>View all</Dropdown.Item>
                <Dropdown.Item eventKey="4-2" icon={<Icon icon="plus" />}>Create new</Dropdown.Item>
              </Dropdown>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
    );
  }
}



export {NavbarComponent, NavSideBarComponent};

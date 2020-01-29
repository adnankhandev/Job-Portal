import React, { Component } from "react";
import { Divider, Schema, Col, Placeholder, Nav, Icon, Dropdown, Navbar, Panel, Content, Form, FormGroup, Header, Container, FormControl, FlexboxGrid, ControlLabel, Button, ButtonToolbar, Footer } from 'rsuite';
import AuthService from './../services/Auth'
import Auth from "../stores/Auth";
import {NavbarComponent, NavSideBarComponent} from "./common/NavBar";

class Dashboard extends Component {
  render() {
    return (
        <Container>
          <Header>
            <NavbarComponent/>
            <Divider/>
            <NavSideBarComponent activeKey={"1"}/>
          </Header>
          <Content>
          </Content>
        </Container>
    );
  }
}


export default Dashboard;
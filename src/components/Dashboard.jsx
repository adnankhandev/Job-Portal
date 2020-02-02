import React, { Component } from "react";
import { Divider, Content, Header, Container, Placeholder, Sidebar, Footer, Panel, Col } from 'rsuite';
import {NavbarComponent, NavSideBarComponent} from "./common/NavBar";

const { Paragraph, Graph, Grid } = Placeholder;
const panelStyle = { background: "transparent", margin: "10px" };
const EmptyCard = props => (
  <Panel {...props} style={{...panelStyle }} shaded>
      <Col>
          <Paragraph rows={props.rows} active/>
      </Col>
  </Panel>
)

class Dashboard extends Component {
  render() {
    return (
      <Container>
        <Header>
            <NavbarComponent />
            <Divider />
        </Header>
        <Container>
            <Sidebar>
                <NavSideBarComponent activeKey={"1"} />
            </Sidebar>
            <Content>
              <EmptyCard rows={10}/>
              <EmptyCard rows={20}/>
            </Content>
        </Container>
        <Footer></Footer>
      </Container>
    );
  }
}


export default Dashboard;
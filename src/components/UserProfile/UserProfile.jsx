import React, { Component } from 'react';
import NavBarComponent from "./../common/NavBar";
import { 
    Divider, 
    Container, 
    Header, 
    Content, 
    Footer, 
    Row, 
    Col, 
    Panel, 
    Avatar, 
    FlexboxGrid,
    Progress,
    Placeholder
} from "rsuite";
import AuthStore from "../../stores/Auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons';
const { Line } = Progress; 
const { Paragraph, Graph, Grid } = Placeholder;

class UserProfile extends Component {
    render() {
        const boldText = { fontFamily: "Arial Narrow", margin: "10px", color: "grey", fontWeight: "bold" };
        const normalText = { fontFamily: "Arial Narrow", margin: "10px", color: "grey" };
        const panelStyle = { background: "white", margin: "10px" };
        const headingText = {  };

        const UserCard = props => (
            <Panel {...props} style={panelStyle} shaded>
                <Col>
                    <FlexboxGrid justify="center" >
                        <Avatar
                            size="lg"
                            justify="center"
                            circle
                            src="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4"
                        />
                    </FlexboxGrid>
                    <FlexboxGrid justify="center" align="middle" style={{margin:"20px"}}>
                        <h6 style={boldText}>{AuthStore.getUser()}</h6>
                        <FontAwesomeIcon style={{ color: "#ffc564" }} icon={faStar} />
                        <h6 style={normalText}>N/A</h6>
                    </FlexboxGrid>
                    <Divider/>
                    <FlexboxGrid justify="space-between">
                        <h6 style={normalText}>Profile Complete</h6>
                        <Line percent={30} showInfo={false} style={{width:160}}/>
                    </FlexboxGrid>
                    <FlexboxGrid justify="space-between">
                        <h6 style={normalText}>Jobs Completed</h6>
                        <Line percent={60} showInfo={false} style={{width:160}}/>
                    </FlexboxGrid>
                    <Divider/>
                    <FlexboxGrid justify="space-between">
                        <h6 style={normalText}>Earned this month</h6>
                        <h6 style={boldText}>£0</h6>
                    </FlexboxGrid>
                </Col>
            </Panel>
        );
        
        const ServicesCard = props => (
            <Panel {...props} style={{...panelStyle, background: "transparent"}} shaded>
                <Col>
                        <Paragraph style={{marginTop:10}} rows={10} columns={10} active/>
                </Col>
            </Panel>
        )
        return (
            <div>
                <Container>
                    <Header>
                        <NavBarComponent {...this.props} />
                    </Header>
                    <Content>
                        <Row>
                            <Col md={8} sm={12}>
                                <UserCard />
                                <ServicesCard />
                            </Col>
                            <Col md={16} sm={12}>
                                <ServicesCard />
                            </Col>
                        </Row>
                    </Content>
                    <Footer>
                        <Grid style={{marginTop:30}} rows={3} columns={4} active/>
                    </Footer>
                </Container>
            </div>
        );
    }
}

export default UserProfile;
import React, { Component } from "react";
import RestUtilities from "../../services/RestUtilities";
import {
    Container, Panel, Row, Col, Content,
    Divider, Header, FlexboxGrid
} from "rsuite";

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL


export class ApplicantsProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emergency_contacts: [],
            employment_history: [],
            reference_details: []
        }
    }

    componentDidMount(){
        console.log(this.props.location.state)
        let {emergency_contact_details, employment_history, personal_details, reference_details} = this.props.location.state
        RestUtilities.get(`${REACT_APP_BASEURL}/emergency-contact-details/${emergency_contact_details.$oid}`)
        .then(response => {
            let results = []
            let ec = response.content.response[0]
            for (let i in ec) {
                if(i !== "_id") {
                    results.push(
                        <Row style={{margin: 10}} key={i}>
                            <Col xs={12}>
                                <b>{i}</b>
                            </Col>
                            <Col xs={12}>
                                {ec[i]}
                            </Col>
                            <Divider/>
                        </Row>
                    )
                }
            }
            this.setState({emergency_contacts: results})
        })
        
        employment_history = employment_history.map((eh) => {
            let results = []
            for (let i in eh) {
                if(i !== "_id") {
                    results.push(
                        <Col style={{margin: 10}} key={i}>
                            <Col xs={12}>
                                <b>{i}</b>
                            </Col>
                            <Col xs={12}>
                                {eh[i]}
                            </Col>
                            <Divider/>
                        </Col>
                    )
                }
            }
            return (
                <Panel shaded style={{margin: 10}}>
                    {results}
                </Panel>
            )
        })
        this.setState({employment_history})
    }

    render() {
        const panelStyle = {backgroundColor: "#F5F5F5", margin: 10}
        return (
            <Container>
                <Header>
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item>
                            <h1>
                                {this.props.location.state.name.toUpperCase()}'s Profile
                            </h1>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Header>
                <Content style={{margin: 10}}>
                    <Panel shaded>
                        <Row>
                            <Col xs={5}>
                                <Panel shaded style={panelStyle}>
                                    <FlexboxGrid justify="center">
                                        <h4>Emergency Contacts</h4>
                                    </FlexboxGrid>
                                    {this.state.emergency_contacts}
                                </Panel>
                            </Col>
                            <Col xs={10}>
                                <Panel shaded style={panelStyle}>
                                <FlexboxGrid justify="center">
                                        <h4>Employment History</h4>
                                    </FlexboxGrid>
                                    {this.state.employment_history}
                                </Panel>
                            </Col>
                        </Row>
                    </Panel>
                </Content>
            </Container>   
        )
    }
}
import React, { Component } from "react";
import mockdata from "./MOCK_DATA";
import mockdata2 from "./MOCK_DATA_2";
import mockdata3 from "./MOCK_DATA_3";
import DataTable from "react-data-table-component";
import RestUtilities from "../../services/RestUtilities";
import {Placeholder, Modal, Panel, Col, Button, FlexboxGrid} from 'rsuite';
const {Paragraph} = Placeholder;


export class Datatable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            show: false,
            overflow: true
          };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close() {
        this.setState({ show: false });
    }
    open(event) {
        this.setState({ show: true });
    }

    componentDidMount() {
        let data
        const BASEURL = "https://job-portal-api1.herokuapp.com/api/v1"
        RestUtilities.get(`${BASEURL}${this.props.endpoint}`)
            .then(response => {
                if (this.props.data === 2) {
                    data = mockdata2
                } else if(this.props.data === 3) {
                    data = mockdata3
                } else {
                    data = mockdata
                }
                this.setState({ data });
            })

    }
    render() {
        return (
            <Panel shaded style={{margin:20}}>
                <Col>
                <Modal show={this.state.show} onHide={this.close}>
                        <Modal.Header>
                            <Modal.Title>Add {this.props.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Paragraph rows={10} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.close} appearance="primary">
                            Save
                            </Button>
                            <Button onClick={this.close} appearance="subtle">
                            Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
                { this.props.title !== "Applicants" &&
                <Col>
                    <FlexboxGrid justify="end">
                        <Button onClick={() => this.open()} appearance="primary">+ Add {this.props.title}</Button>
                    </FlexboxGrid>
                </Col>}
                <Col>
                    <DataTable
                        title={this.props.title}
                        columns={this.props.columns}
                        data={this.state.data}
                        highlightOnHover
                        pointerOnHover
                        pagination
                        highlightOnHover
                        striped
                    />
                </Col>
            </Panel>
        );
    }
}

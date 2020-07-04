import React, { Component } from "react";
import DataTable from "react-data-table-component";
import RestUtilities from "../../services/RestUtilities";
import {Panel, Col, Button, FlexboxGrid} from 'rsuite';

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL
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
        RestUtilities.get(`${REACT_APP_BASEURL}${this.props.endpoint}`)
            .then(response => {
                this.setState({ data: response });
            })

    }
    render() {
        return (
            <Panel shaded style={{margin:20}}>
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
                        striped
                    />
                </Col>
            </Panel>
        );
    }
}

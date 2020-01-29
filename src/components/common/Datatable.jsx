import React, { Component } from "react";
import mockdata from "./MOCK_DATA";
import DataTable from "react-data-table-component";
import RestUtilities from "../../services/RestUtilities";

export class Datatable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: mockdata,
        };
    }

    componentDidMount() {
        const BASEURL = "https://job-portal-api1.herokuapp.com/api/v1"
        RestUtilities.get(`${BASEURL}${this.props.endpoint}`)
        .then(response => {
            
            this.setState({data: response.content.response});
            console.log("response: ", this.state.data);
        })

    }
    render() {
        
        return (
            <DataTable
                title={this.props.title}
                columns={this.props.columns}
                data={this.state.data}
                highlightOnHover
                pointerOnHover
                pagination
            />
        );
    }
}

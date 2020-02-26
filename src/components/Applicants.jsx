import React, { Component } from "react";
import { 
    Sidebar, 
    Footer, 
    Divider, 
    Content, 
    Header, 
    Container, 
    Panel 
} from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import DataTable from "react-data-table-component";
import RestUtilities from "../services/RestUtilities";
import { LinearIndeterminate } from "./common/Loader";
import {ProfileModal} from "./common/ProfileModal";
const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL

class Applicants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pending: true,
            showProfile: false,
            profileData: {}
        }
    }

    componentDidMount() {

        RestUtilities.get(`${REACT_APP_BASEURL}/users`)
            .then(response => {
                this.setState({data:response.content.response})
                this.setState({pending: false})
            })
    }

    close = () => {
        this.setState({ showProfile: false });
    }

    rowClick = (row) => {
        this.setState({ showProfile: true });
        this.setState({ profileData: row });
    }

    render() {
        const columns = [
            {
                name: 'Title',
                selector: 'title',
                sortable: true,
                maxWidth: "100px"
            },
            {
                name: 'Name',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Email',
                selector: 'email',
                sortable: true,
            },
            {
                name: 'Mobile Number',
                selector: 'mobile_number',
                sortable: true,
            },
            {
                name: 'Username',
                selector: 'username',
                sortable: true,
            },
            {
                name: 'User Type',
                selector: 'user_type',
                sortable: true,
            },
        ];
        return (
            <Container>
                <Header>
                    <NavbarComponent />
                    <Divider />
                </Header>
                <Container>
                    <Sidebar>
                        <NavSideBarComponent/>
                    </Sidebar>
                    <Content>
                        <Panel shaded>
                            <DataTable
                                title={"Applicants"}
                                columns={columns}
                                data={this.state.data}
                                progressPending={this.state.pending}
                                progressComponent={<LinearIndeterminate />}
                                onRowClicked={(row) => this.rowClick(row)}
                                highlightOnHover
                                pointerOnHover
                                pagination
                                striped
                            />
                            <ProfileModal
                                title={"Applicant"}
                                show={this.state.showProfile} 
                                close={this.close} 
                                data={this.state.profileData}
                            />
                        </Panel>
                    </Content>
                </Container>
                <Footer></Footer>
            </Container>
        );
    }
}

export default Applicants;
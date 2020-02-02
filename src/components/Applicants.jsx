import React, { Component } from "react";
import { Sidebar, Footer, Divider, Content, Header, Container } from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import { Datatable } from "./common/Datatable";


class Applicants extends Component {
    render() {
        const columns = [
            {
                name: 'Id',
                selector: 'id',
                sortable: true,
                maxWidth: "100px"
            },
            {
                name: 'First Name',
                selector: 'firstName',
                sortable: true,
            },
            {
                name: 'Last Name',
                selector: 'lastName',
                sortable: true,
            },
            {
                name: 'City',
                selector: 'city',
                sortable: true,
            },
            {
                name: 'Street',
                selector: 'street',
                sortable: true,
            },
            {
                name: 'Company Name',
                selector: 'companyName',
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
                        <NavSideBarComponent activeKey={"2"} />
                    </Sidebar>
                    <Content>
                        <Datatable title={"Applicants"} columns={columns} endpoint={"/users"} data={1}/>
                    </Content>
                </Container>
                <Footer></Footer>
            </Container>
        );
    }
}

export default Applicants;
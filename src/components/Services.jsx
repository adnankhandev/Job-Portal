import React, { Component } from "react";
import { Sidebar, Footer, Divider, Content, Header, Container } from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import { Datatable } from "./common/Datatable";

class Services extends Component {
    render() {
        const columns2 = [
            {
                name: 'Service',
                selector: 'service',
                sortable: true,
            }]
        const columns = [
            {
                name: 'Id',
                selector: 'id',
                sortable: true,
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
                        <NavSideBarComponent activeKey={"3"} />
                    </Sidebar>
                    <Content>
                        <Datatable title={"Services"} columns={columns2} endpoint={"/service"} />
                    </Content>
                </Container>
                <Footer></Footer>
            </Container>
        );
    }
}


export default Services;
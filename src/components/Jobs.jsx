import React, { Component } from "react";
import { Sidebar, Footer, Divider, Content, Header, Container } from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import { Datatable } from "./common/Datatable";


class Jobs extends Component {
    render() {
        const columns = [
            {
                name: 'Id',
                selector: 'id',
                sortable: true,
                maxWidth: "100px"
            },
            {
                name: 'Customer Name',
                selector: 'customer_name',
                sortable: true,
                maxWidth: "300px"
            },
            {
                name: 'Job Description',
                selector: 'job_description',
                sortable: true,
                wrap: true
            },
            {
                name: 'Wages',
                selector: 'wages',
                sortable: true,
                maxWidth: "100px"
            },
            {
                name: 'Date of Job',
                selector: 'date',
                sortable: true,
                maxWidth: "200px"
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
                        <Datatable title={"Jobs"} columns={columns} endpoint={"/jobs"} data={3}/>
                    </Content>
                </Container>
                <Footer></Footer>
            </Container>
        );
    }
}


export default Jobs;
import React, { Component } from "react";
import { 
    Icon, Alert, Schema, Col, Sidebar,
    Footer, Divider, Content, Header, 
    Container, FlexboxGrid, Button, 
    Panel, Input
} from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import DataTable from "react-data-table-component";
import RestUtilities from "../services/RestUtilities";
import { CustomModal } from "../components/common/CustomModal";
import { ProfileModal } from "../components/common/ProfileModal";
import { LinearIndeterminate } from "./common/Loader";

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL
const { StringType } = Schema.Types;

class Services extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            show: false,
            showProfile: false,
            pending: true,
            FormValue: {},
            FormError: {},
            profileData: {}
        }

        this.FormReference = React.createRef()
    }

    open = () => {
        this.setState({ show: true });
    }

    openProfile = (row) => {
        this.setState({ showProfile: true });
        this.setState({ profileData: row });
    }

    close = () => {
        this.setState({ show: false });
        this.setState({ showProfile: false });
    }

    submit = () => {
        const goahead = this.FormReference.current.check()

        if (goahead) {
            this.close()

            RestUtilities.post(`${REACT_APP_BASEURL}/service`, this.state.FormValue)
            .then(response => {
                if (!response.is_error) {
                    Alert.success(response.content.message.toString());
                    setTimeout(function(){                         
                        window.location.href = "/services";
                    }, 500);
                } else {
                    Alert.error(response.error_content.error.toString());
                }
            })
        }

        this.setState({FormValue: {}})
    }

    FormValue = (FormValue) => {
        this.setState({FormValue})
    }

    FormError = (FormError) => {
        this.setState({FormError})
    }

    componentDidMount() {
        RestUtilities.get(`${REACT_APP_BASEURL}/service`)
        .then(response => {            
            this.setState({data:response.content.response})
            this.setState({pending: false})
        })
    }

    render() {
        const serviceSchema = Schema.Model({
            service: StringType().isRequired('Service name is required.'),
            description: StringType().isRequired('Service description is required.'),
        });

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
                            <Col>
                                <FlexboxGrid>
                                    <Button onClick={() => this.open()} appearance="primary">+ Add Service</Button>
                                </FlexboxGrid>
                                <CustomModal
                                    title={"Services"}
                                    show={this.state.show} 
                                    close={this.close} 
                                    submit={this.submit} 
                                    FormValue={this.FormValue}
                                    FormError={this.FormError}
                                    model={serviceSchema}
                                    columns={columns}
                                    fref={this.FormReference}
                                />
                                <ProfileModal
                                    title={"Services"}
                                    show={this.state.showProfile} 
                                    close={this.close} 
                                    data={this.state.profileData}
                                />
                            </Col>
                            <DataTable
                                title={"Services"}
                                columns={columns}
                                data={this.state.data}
                                progressPending={this.state.pending}
                                progressComponent={<LinearIndeterminate />}
                                onRowClicked={(row) => this.openProfile(row)}
                                highlightOnHover
                                pointerOnHover
                                pagination
                                striped
                            />
                        </Panel>
                    </Content>
                </Container>
                <Footer></Footer>
            </Container>
        );
    }
}



const Edit = () => {
    
}

const Delete = (id) => {
    RestUtilities.delete(`${REACT_APP_BASEURL}/service/${id}`)
    .then(response => {
        if (!response.is_error) {
            Alert.success(response.content.response.toString());
            setTimeout(function(){                         
                window.location.href = "/services";
            }, 500);
        } else {
            Alert.error(response.error_content.error.toString());
        }
    })
}

const CustomAction = (props) => (
    <Col>
        <Button onClick={() => Edit(props.id)}><Icon icon="edit" size="lg"/></Button> 
        <Button onClick={() => Delete(props.id)}><Icon icon="trash" size="lg"/></Button>
    </Col>
)

const columns = [
    {
        name: 'Service Name',
        selector: 'service',
        sortable: true,
        maxWidth: "400px",
        accepter: Input,
        type: "string",
        profile: true
    },
    {
        name: 'Description',
        selector: 'description',
        sortable: true,
        wrap: true,
        accepter: Input,
        type: "array", 
        profile: true
    },
    {
        name: "Actions",
        maxWidth: "150px",
        cell: row => <CustomAction id={row._id.$oid}/>,
    }
];

export default Services;
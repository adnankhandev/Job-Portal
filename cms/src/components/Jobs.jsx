import React, { Component } from "react";
import {
    Icon, Alert, Schema, Col, Sidebar,
    Footer, Divider, Content, Header,
    Container, FlexboxGrid, Button, Panel,
    Input, InputNumber, DatePicker, CheckPicker
} from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import DataTable from "react-data-table-component";
import RestUtilities from "../services/RestUtilities";
import { CustomModal } from "../components/common/CustomModal";
import { LinearIndeterminate } from "./common/Loader";
import moment from "moment"

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL
const { NumberType, StringType, DateType } = Schema.Types;

class Jobs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allservices: [],
            data: [],
            show: false,
            pending: true,
            FormValue: {
                job_title: '',
                customer_name: '',
                job_description: '',
                required_services: [],
                start_date_to_apply: Date(),
                last_date_to_apply: Date(),
                pay: '',
            },
            FormError: {},
        }

        this.FormReference = React.createRef()
    }

    open = () => {
        this.setState({ show: true });
    }

    close = () => {
        this.setState({ show: false });
    }

    submit = () => {
        const goahead = this.FormReference.current.check()
        const {FormValue} = this.state

        if (goahead) {
            FormValue.start_date_to_apply = FormValue.start_date_to_apply.toUTCString()
            FormValue.last_date_to_apply = FormValue.last_date_to_apply.toUTCString()
            this.close()

            RestUtilities.post(`${REACT_APP_BASEURL}/jobs`, FormValue)
                .then(response => {
                    if (!response.is_error) {
                        Alert.success(response.content.message.toString());
                        setTimeout(function(){                         
                            window.location.href = "/jobs";
                        }, 500);
                    } else {
                        Alert.error(response.error_content.error.toString());
                    }
                })
        }

        this.setState({ FormValue: {} })
    }

    FormValue = (FormValue) => {
        this.setState({ FormValue })
    }

    FormError = (FormError) => {
        this.setState({ FormError })
    }

    componentDidMount() {
        RestUtilities.get(`${REACT_APP_BASEURL}/jobs`)
        .then(response => {
            this.setState({ data: response.content.response })
            this.setState({ pending: false })
        })

        RestUtilities.get(`${REACT_APP_BASEURL}/service`)
        .then(response => {
            let mappedServices = response.content.response.map((current) => {
                return {label: current.service, value: current._id.$oid}
            })
            this.setState({ allservices: mappedServices })
        })
    }

    render() {
        let { allservices } = this.state

        const Edit = () => {

        }
        
        const Delete = (id) => {
            RestUtilities.delete(`${REACT_APP_BASEURL}/jobs/${id}`)
                .then(response => {
                    if (!response.is_error) {
                        Alert.success(response.content.response.toString());
                        setTimeout(function(){                         
                            window.location.href = "/jobs";
                        }, 500);
                    } else {
                        Alert.error(response.error_content.error.toString());
                    }
                })
        }
        
        const CustomAction = (props) => (
            <Col>
                <Button onClick={() => Edit(props.id)}><Icon icon="edit" size="lg" /></Button>
                <Button onClick={() => Delete(props.id)}><Icon icon="trash" size="lg" /></Button>
            </Col>
        )
        const columns = [
            {
                name: 'Job Title',
                selector: 'job_title',
                sortable: true,
                maxWidth: "100px",
                accepter: Input,
                table: true
            },
            {
                name: 'Customer Name',
                selector: 'customer_name',
                sortable: true,
                maxWidth: "300px",
                accepter: Input,
                table: true
            },
            {
                name: 'Job Description',
                selector: 'job_description',
                sortable: true,
                wrap: true,
                accepter: Input,
                table: true
            },
            {
                name: 'Wages',
                selector: 'pay',
                sortable: true,
                maxWidth: "100px",
                accepter: InputNumber,
                table: true
            },
            {
                name: 'Required Services',
                selector: 'required_services',
                sortable: true,
                accepter: CheckPicker,
                data: allservices,
                table: false
            },
            {
                name: 'Apply from',
                selector: 'start_date_to_apply',
                sortable: true,
                maxWidth: "200px",
                accepter: DatePicker,
                placement: "topStart",
                format: row => moment(row.$date).format('ll'),
                table: true
            },
            {
                name: 'Apply till',
                selector: 'last_date_to_apply',
                sortable: true,
                maxWidth: "200px",
                accepter: DatePicker,
                placement: "topStart",
                format: row => moment(row.$date).format('ll'),
                table: true
            },
            {
                name: "Actions",
                maxWidth: "150px",
                table: true,
                cell: row => <CustomAction id={row._id.$oid} />
            }
        ];

        const serviceSchema = Schema.Model({
            job_title: StringType().isRequired('Job title is required.'),
            customer_name: StringType().isRequired('Customer name is required.'),
            job_description: StringType().isRequired('Job description is required.'),
            start_date_to_apply: DateType().min(new Date(), 'Minimum date is today').isRequired('Start date is required'),
            last_date_to_apply: DateType().addRule((value, data) => {
                if (value <= data.start_date_to_apply) {
                  return false;
                }
                return true;
              }, 'Last date to apply must be after start date'),
            pay: NumberType().isRequired("Wages are required"),
        });

        const rowClick = (row) => {
            console.log(row)
        }

        return (
            <Container>
                <Header>
                    <NavbarComponent />
                    <Divider />
                </Header>
                <Container>
                    <Sidebar>
                        <NavSideBarComponent />
                    </Sidebar>
                    <Content>
                        <Panel shaded>
                            <Col>
                                <FlexboxGrid>
                                    <Button onClick={() => this.open()} appearance="primary">+ Add Job</Button>
                                </FlexboxGrid>
                                <CustomModal
                                    title={"Jobs"}
                                    show={this.state.show}
                                    close={this.close}
                                    submit={this.submit}
                                    FormValue={this.FormValue}
                                    FormError={this.FormError}
                                    model={serviceSchema}
                                    columns={columns}
                                    fref={this.FormReference}
                                />
                            </Col>
                            <DataTable
                                title={"Jobs"}
                                columns={columns.filter((col) => {return col.table})    }
                                data={this.state.data}
                                progressPending={this.state.pending}
                                progressComponent={<LinearIndeterminate />}
                                highlightOnHover
                                pointerOnHover
                                pagination
                                striped
                                onRowClicked={(row) => rowClick(row)}
                            />
                        </Panel>
                    </Content>
                </Container>
                <Footer></Footer>
            </Container>
        );
    }
}

export default Jobs;
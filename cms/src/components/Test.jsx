import React, { Component } from "react";
import {
    Icon, Alert, Schema, Col, Sidebar,
    Footer, Divider, Content, Header,
    Container, Button, Panel,
    Input, List
} from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import DataTable from "react-data-table-component";
import RestUtilities from "../services/RestUtilities";
import { CustomModal } from "../components/common/CustomModal";
import { LinearIndeterminate } from "./common/Loader";

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL
const { StringType } = Schema.Types;

class Test extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',
            data: [],
            show: false,
            pending: true,
            FormValue: {},
            FormError: {},
        }
        this.FormReference = React.createRef()
    }

    open = (id) => {
        this.setState({ show: true, id });
    }

    close = () => {
        this.setState({ show: false });
    }

    submit = () => {
        const goahead = this.FormReference.current.check()
        const { FormValue, id } = this.state

        if (goahead) {
            this.close()
            RestUtilities.patch(`${REACT_APP_BASEURL}/service/${id}`, FormValue)
                .then(response => {
                    if (!response.is_error) {
                        Alert.success(response.content.response.toString());
                        setTimeout(function () {
                            window.location.href = "/tests";
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
        RestUtilities.get(`${REACT_APP_BASEURL}/service`)
            .then(response => {
                this.setState({ data: response.content.response })
                this.setState({ pending: false })
            })
    }

    render() {
        // const Delete = (id) => {
        //     RestUtilities.delete(`${REACT_APP_BASEURL}/tests/${id}`)
        //         .then(response => {
        //             if (!response.is_error) {
        //                 Alert.success(response.content.response.toString());
        //                 setTimeout(function () {
        //                     window.location.href = "/tests";
        //                 }, 500);
        //             } else {
        //                 Alert.error(response.error_content.error.toString());
        //             }
        //         })
        // }

        const CustomAction = (props) => (
            <Col>
                <Button onClick={() => this.open(props.id)}><Icon icon="plus" size="sm" /></Button>
            </Col>
        )
        const columns = [
            {
                name: 'Service Name',
                selector: 'service',
                sortable: true,
                maxWidth: "400px",
                table: true
            },
            {
                name: 'Questions',
                selector: 'questions',
                sortable: true,
                wrap: true,
                table: true,
                accepter: Input,
                cell: row =>
                    (<div>
                        <Panel>
                            <List size='sm' hover>
                                {row.questions.map((item, index) =>
                                    <List.Item key={index} index={index}>
                                        {item}
                                    </List.Item>
                                )}
                            </List>
                        </Panel>
                    </div>)
            },
            {
                name: "Actions",
                maxWidth: "150px",
                cell: row => <CustomAction id={row._id.$oid} />,
                table: true
            }
        ];

        // const questionSchema = Schema.Model({
        //     question: StringType().isRequired('Question text is required'),
        //     answer: StringType().isRequired('Answer text is required'),
        //     options: ArrayType().of(StringType(), 'Options must be text'),
        //     multiple_choice: BooleanType().isRequired('Is the question multiple choice or not?'),
        // });

        const questionSchema = Schema.Model({
            questions: StringType().isRequired('Question text is required'),
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
                                {/* <FlexboxGrid>
                                    <Button onClick={() => this.open()} appearance="primary">+ Add Question</Button>
                                </FlexboxGrid> */}
                                <CustomModal
                                    title={"Questions"}
                                    show={this.state.show}
                                    close={this.close}
                                    submit={this.submit}
                                    FormValue={this.FormValue}
                                    FormError={this.FormError}
                                    model={questionSchema}
                                    columns={columns}
                                    fref={this.FormReference}
                                />
                            </Col>
                            <DataTable
                                title={"Service Tests"}
                                columns={columns.filter((col) => { return col.table })}
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

export default Test;
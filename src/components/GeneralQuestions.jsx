import React, { Component } from "react";
import {
    Icon, Alert, Schema, Col, Sidebar,
    Footer, Divider, Content, Header,
    Container, FlexboxGrid, Button, Panel,
    Input
} from 'rsuite';
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import DataTable from "react-data-table-component";
import RestUtilities from "../services/RestUtilities";
import { CustomModal } from "../components/common/CustomModal";
import { LinearIndeterminate } from "./common/Loader";
import { BooleanType } from "schema-typed";

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL
const { ArrayType, StringType } = Schema.Types;

class GeneralQuestions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            show: false,
            pending: true,
            FormValue: {},
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
            this.close()

            RestUtilities.post(`${REACT_APP_BASEURL}/general-questions`, FormValue)
            .then(response => {
                if (!response.is_error) {
                    Alert.success(response.content.message.toString());
                    setTimeout(function(){                         
                        window.location.href = "/general-questions";
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
        RestUtilities.get(`${REACT_APP_BASEURL}/general-questions`)
        .then(response => {
            this.setState({ data: response.content.response })
            this.setState({ pending: false })
        })
    }

    render() {
        const Edit = () => {

        }
        
        const Delete = (id) => {
            RestUtilities.delete(`${REACT_APP_BASEURL}/general-question/${id}`)
                .then(response => {
                    if (!response.is_error) {
                        Alert.success(response.content.response.toString());
                        setTimeout(function(){                         
                            window.location.href = "/General-Questions";
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
                name: 'Question',
                selector: 'question',
                sortable: true,
                accepter: Input,
                table: true
            },
            {
                name: 'Answer',
                selector: 'answer',
                sortable: true,
                accepter: Input,
                table: true
            },
            {
                name: "Actions",
                maxWidth: "150px",
                table: true,
                cell: row => <CustomAction id={row._id.$oid} />
            }
        ];

        const questionSchema = Schema.Model({
            question: StringType().isRequired('Question text is required'),
            answer: StringType().isRequired('Answer text is required'),
            options: ArrayType().of(StringType(), 'Options must be text'),
            multiple_choice: BooleanType().isRequired('Is the question multiple choice or not?'),
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
                                    <Button onClick={() => this.open()} appearance="primary">+ Add Question</Button>
                                </FlexboxGrid>
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
                                title={"General Questions"}
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

export default GeneralQuestions;
import React, { Component } from "react";
import {
    Icon, Alert, Schema, Col, Sidebar,
    Footer, Divider, Content, Header,
    Container, FlexboxGrid, Button,
    Input, Toggle, Modal, Form, Panel,
    SelectPicker, List
} from 'rsuite';
import TextField from "./common/TextField";
import { NavbarComponent, NavSideBarComponent } from "./common/NavBar";
import DataTable from "react-data-table-component";
import { ProfileModal } from "../components/common/ProfileModal";
import RestUtilities from "../services/RestUtilities";
import { LinearIndeterminate } from "./common/Loader";
import { BooleanType } from "schema-typed";

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL
const { StringType } = Schema.Types;

class GeneralQuestions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            options_data: [],
            show: false,
            showProfile: false,
            pending: true,
            FormValue: {
                question: '',
                answer: '',
                multiple_choice: false,
                options: []
            },
            profileData: {},
            FormError: {},
        }
        this.FormReference = React.createRef()
    }

    open = () => {
        this.setState({ show: true });
    }

    close = () => {
        this.setState({ show: false });
        this.setState({ showProfile: false });
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
        if(typeof(FormValue.options) === "string" && FormValue.options.length > 1) {
            let options = FormValue.options 
            FormValue.options = options.split(",").map(option => option.trim())
            let options_data = options.split(",").map((option) => {return {label: option.trim(), value: option.trim()}})
            this.setState({ options_data })
        }
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
            },
            {
                name: "Options",
                selector: 'options',
                cell: row => 
                (<div>
                    <Panel>
                        <List size='sm' hover>
                            {row.options.map((item, index) =>
                                <List.Item key={index} index={index}>
                                    {item}
                                </List.Item>
                            )}
                        </List>
                    </Panel>
                </div>)
            },
            {
                name: 'Answer',
                selector: 'answer',
                sortable: true,
                accepter: Input,
            },
            {
                name: "Actions",
                maxWidth: "150px",
                cell: row => <CustomAction id={row._id.$oid} />
            }
        ];

        const questionSchema = Schema.Model({
            question: StringType().isRequired('Question text is required'),
            answer: StringType().isRequired('Answer text is required'),
            multiple_choice: BooleanType(),
        });

        const rowClick = (row) => {
            this.setState({ showProfile: true });
            this.setState({ profileData: row });
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
                                <Modal show={this.state.show} onHide={this.close}>
                                    <Modal.Header>
                                        <Modal.Title>Add {this.state.title}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form fluid
                                            ref={this.FormReference}
                                            onChange={FormValue => {
                                                this.FormValue(FormValue)
                                            }}
                                            onCheck={FormError => {
                                                this.FormError(FormError);
                                            }}
                                            formValue={this.state.FormValue}
                                            model={questionSchema}
                                        >
                                            <TextField name={"question"} label={"Question"} accepter={Input}/>
                                            <TextField name={"multiple_choice"} label={"Multiple Choice"} accepter={Toggle}/>
                                            {
                                                !this.state.FormValue.multiple_choice ? 
                                                    <TextField name={"answer"} label={"Answer"} accepter={Input}/> 
                                                    :
                                                    <div>
                                                        <TextField name={"options"} label={"Comma Separated Options"} accepter={Input}/>
                                                        <TextField name={"answer"} label={"Answer"} data={this.state.options_data} accepter={SelectPicker}/>
                                                    </div>
                                            }
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={() => this.submit() } appearance="primary">
                                            Add
                                        </Button>
                                        <Button onClick={() => this.close() } appearance="subtle">
                                            Cancel
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                                <ProfileModal
                                    title={"General Questions"}
                                    show={this.state.showProfile} 
                                    close={this.close} 
                                    data={this.state.profileData}
                                />
                            </Col>
                            <DataTable
                                title={"General Questions"}
                                columns={columns}
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
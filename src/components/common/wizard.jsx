import React, { Fragment } from "react";
import { Formik, Field } from "formik";
import { FormGroup, Label, Button } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faUserCircle, faAmbulance, faQuestion, faQuestionCircle, faCogs, faIdCard, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { Steps, Divider } from 'rsuite';


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const required = value => (value ? undefined : "Required");

export const Error = ({ name }) => (
    <Field
        name={name}
        render={({ form: { touched, errors, setFeildValue } }) =>
            touched[name] && errors[name] ? <span>{errors[name]}</span> : null
        }
    />
);

export class Wizard extends React.Component {
    static Page = ({ children, parentState }) => {
        return children(parentState);
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            values: props.initialValues
        };
    }

    next = values => {
        // console.log(values)
        this.setState(state => ({
            page: Math.min(state.page + 1, this.props.children.length - 1),
            values
        }));
    }

    previous = () =>
        this.setState(state => ({
            page: Math.max(state.page - 1, 0)
        }));

    validate = values => {
        const activePage = React.Children.toArray(this.props.children)[
            this.state.page
        ];
        return activePage.props.validate ? activePage.props.validate(values) : {};
    };

    handleSubmit = (values, bag) => {
        const { children, onSubmit } = this.props;
        const { page } = this.state;
        const isLastPage = page === React.Children.count(children) - 1;
        if (isLastPage) {
            return onSubmit(values, bag);
        } else {
            this.next(values);
            bag.setSubmitting(false);
        }
    };

    render() {
        const { children } = this.props;
        const { page, values } = this.state;
        const activePage = React.Children.toArray(children)[page];
        console.log("active page", activePage);
        let className = 'col-md-12'
        const isLastPage = page === React.Children.count(children) - 1;
        return (
            <Fragment>
                <h1 className="display-4" style={{ padding: '5px', color: 'white', fontSize: '30px' }}>{activePage.props.headingText}</h1>
                <div style={{ backgroundColor: 'white', margin:'10px', padding:'10px',  borderRadius: '10px' }} >
                    <Steps style={{width:1200}} current={page}>
                        <Steps.Item title="Personal Details" icon={<FontAwesomeIcon size="lg" icon={faUserCircle} />} />
                        <Steps.Item title="Emergency Contact" icon={<FontAwesomeIcon icon={faAmbulance} size="lg" />} />
                        <Steps.Item title="General Questions" icon={<FontAwesomeIcon icon={faQuestionCircle} size="lg" />} />
                        <Steps.Item title="Services Offered" icon={<FontAwesomeIcon icon={faCogs} size="lg" />} />
                        <Steps.Item title="References" icon={<FontAwesomeIcon icon={faIdCard} size="lg" />} />
                        <Steps.Item title="Availibility" icon={<FontAwesomeIcon icon={faStopwatch} size="lg" />} />
                    </Steps>
                </div>
                <div className={className} style={{ backgroundColor: 'white', paddingTop: '15px', borderRadius: '10px' }} >
                    <Formik
                        initialValues={values}
                        enableReinitialize={false}
                        validate={this.validate}
                        onSubmit={this.handleSubmit}
                        render={props => (
                            <form onSubmit={props.handleSubmit}>
                                {React.cloneElement(activePage, { parentState: { ...props } })}
                                <FormGroup>
                                    {page > 0 && (
                                        <button type="button" onClick={this.previous} style={{ outline: "none" }} className="float-left border-0 bg-transparent" >

                                            <FontAwesomeIcon style={{ 'color': "#376898" }} icon={faArrowLeft} />

                                            <span style={{ 'color': "#376898" }}>Back</span>
                                        </button>
                                    )}



                                    {!isLastPage && <button type="Submit" style={{ outline: "none" }} className="float-right border-0 bg-transparent" >
                                        <span style={{ 'color': "#376898" }}>Next</span>
                                        <FontAwesomeIcon style={{ 'color': "#376898" }} icon={faArrowRight} />
                                    </button>}
                                    {isLastPage && (

                                        <button type="Submit" style={{ outline: "none" }} className="float-right border-0 bg-transparent" >
                                            <Label>Save and Continue</Label>
                                            <FontAwesomeIcon style={{ 'color': "#376898" }} icon={faArrowRight} />
                                        </button>

                                    )}
                                </FormGroup>

                            </form>
                        )}
                    />
                </div>
            </Fragment>
        );
    }
}

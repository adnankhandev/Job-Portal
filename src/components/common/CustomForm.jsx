import TextField from "./TextField";
import React, { Component } from "react";
import { Form } from "rsuite";

export default class CustomForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            FormValue: {}
        }
    }

    render() {
        const mappingFunction = field => <TextField name={field.selector} label={field.name} accepter={field.accepter} key={field.selector} data={field.data} placement={field.placement}/>;
        let FIELDS = this.props.columns.filter((field) => {return field.accepter !== undefined})
        FIELDS = FIELDS.map(mappingFunction)
        return (
            <Form fluid
                ref={this.props.fref}
                onChange={FormValue => {
                    this.setState({FormValue})
                    this.props.FormValue(FormValue)
                }}
                onCheck={FormError => {
                    this.setState({FormError})
                    this.props.FormError(FormError);
                }}
                formValue={this.state.FormValue}
                model={this.props.model}
            >
                {FIELDS}
            </Form>
        )
    }
}
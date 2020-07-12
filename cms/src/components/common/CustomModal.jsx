import React, { Component } from "react";
import { Button, Modal } from "rsuite";
import CustomForm from "./CustomForm";

export class CustomModal extends Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header>
                    <Modal.Title>Add {this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CustomForm
                        FormValue={this.props.FormValue} 
                        FormError={this.props.FormError} 
                        model={this.props.model}
                        columns={this.props.columns}
                        fref={this.props.fref}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.props.submit() } appearance="primary">
                        Add
                    </Button>
                    <Button onClick={() => this.props.close() } appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
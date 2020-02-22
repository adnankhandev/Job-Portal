import React, { Component } from "react";
import { Button, Modal, Panel } from "rsuite";

export class ProfileModal extends Component {
    render() {
        const {data, columns} = this.props
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header>
                    <Modal.Title>{this.props.title} Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Panel>
        {typeof(columns)}
                    </Panel>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.props.close() } appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
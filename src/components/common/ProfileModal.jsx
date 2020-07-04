import React, { Component } from "react";
import { Button, Modal, Panel, ControlLabel } from "rsuite";

export class ProfileModal extends Component {

    render() {
        const { data } = this.props
        let FIELDS = []
        for (var d in data) {
            if (d !== "_id")
                FIELDS.push({label: d, value: data[d]})
        }

        const mappingFunction = (field) => <ControlLabel key={field}><b>{field.label}</b> : {field.value}<br/></ControlLabel>
        FIELDS = FIELDS.map(mappingFunction)
        
        return (
            <Modal show={this.props.show} onHide={this.props.close}>
                <Modal.Header>
                    <Modal.Title>{this.props.title} Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Panel>
                        {FIELDS}
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
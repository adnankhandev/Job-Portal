import React from "react";
import { FormControl, FormGroup, ControlLabel} from "rsuite";

export default class TextField extends React.PureComponent {
  render() {
    const { name, label, accepter, data, ...props } = this.props;
    return (
      <FormGroup>
        <ControlLabel>{label} </ControlLabel>
        <FormControl name={name} label={label} accepter={accepter} data={data} {...props} />
      </FormGroup>
    );
  }
}
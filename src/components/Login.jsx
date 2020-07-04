import React, { Component } from "react";
import { Alert, Schema, Panel, Content, Form, FormGroup, Header, Container, FormControl, FlexboxGrid, ControlLabel, Button, ButtonToolbar, Footer } from 'rsuite';
import AuthService from './../services/Auth'
import Auth from "../stores/Auth";
import jwt_decode from "jwt-decode";
import {NavbarComponent} from "./common/NavBar";
const { StringType } = Schema.Types;

class TextField extends React.PureComponent {
  render() {
    const { name, label, accepter, ...props } = this.props;
    return (
      <FormGroup>
        <ControlLabel>{label} </ControlLabel>
        <FormControl name={name} accepter={accepter} {...props} />
      </FormGroup>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValue: {
        username: '',
        password: '',
      },
      formError: {}
    };
  }

  render() {
    const auth = new AuthService();
    // const ServicesCard = props => (
    //   <Panel {...props} style={{ ...contentStyle, background: "transparent" }} shaded>
    //     <Col>
    //       <Paragraph style={{ marginTop: 10 }} rows={10} columns={10} active />
    //     </Col>
    //   </Panel>
    // )

    const model = Schema.Model({
      username: StringType().isRequired('This field is required.'),
      password: StringType().isRequired('This field is required.'),
    });
    const { formValue } = this.state;

    const signIn = () => {
      const { formValue } = this.state;
      auth.signIn(formValue).then(response => {
        if (!response.is_error) {
          const decoded = jwt_decode(response.content.access_token)
          Auth.setUser(decoded.identity);

          this.props.history.push("/",{ response: response.content.message });
      }
      else{
          // debugger
          
          Alert.error(response.error_content.error.toString());
      }
      }).catch(error => {

      })
    }
    const contentStyle = { marginTop: 50 };
    return (
      <div className="show-fake-browser login-page">
        <Container>
          <Header>
            <NavbarComponent/>
          </Header>
          <Content style={contentStyle}>
            <FlexboxGrid justify="center">
              <FlexboxGrid.Item colspan={8}>
                <Panel header={<h3>Login</h3>} bordered>
                  <Form fluid
                    ref={ref => (this.form = ref)}
                    onChange={formValue => {
                      this.setState({ formValue });
                    }}
                    onCheck={formError => {
                      this.setState({ formError });
                    }}
                    formValue={formValue}
                    model={model}
                  >
                    <TextField name="username" label="Username" />
                    <TextField name="password" label="Password" type="password" />
                    <ButtonToolbar>
                      <Button appearance="primary" onClick={signIn}>
                        Submit
                      </Button>
                    </ButtonToolbar>
                  </Form>
                </Panel>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Content>
          <Footer>
          </Footer>
        </Container>
      </div>
    );
  }
}

export default Login;

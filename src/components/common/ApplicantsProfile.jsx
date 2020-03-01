import React, { Component } from "react";
import RestUtilities from "../../services/RestUtilities";

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL


export class ApplicantsProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    
    componentDidMount(){
        const {emergency_contact_details, employment_history, personal_details, reference_details} = this.props.location.state
        RestUtilities.get(`${REACT_APP_BASEURL}/emergency-contact-details/${emergency_contact_details.$oid}`)
        .then(response => {
            this.setState({data: {...this.state.data, emergency_contacts: response.content.response}})
        })
        
        let emp_hist = []
        employment_history.map((eh) => {
              emp_hist.push(eh)
        })

        console.log("emp_hist: ", emp_hist)
        this.setState({data: emp_hist})
        console.log("this.state.data: ", this.state.data)
    }

    render() {
        return (
            <div>
                <a>This is a test {this.props.location.state.username}</a>
            </div>   
        )
    }
}
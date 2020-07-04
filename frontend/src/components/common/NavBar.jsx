import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText
} from 'reactstrap';
import {Badge} from "rsuite";
import Button from 'reactstrap/lib/Button';
import { Link } from 'react-router-dom';

import AuthService from "../../services/Auth";
import Auth from '../../stores/Auth';

let auth=new AuthService();

const NavbarComponent = (props) => {
  console.log("Nav", props)
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="" light expand="md">
        <Link to='/'>
          <NavbarBrand >Job Portal</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/jobs/">Home</NavLink>
            </NavItem>
            {AuthService.isSignedIn() && <NavItem>
              <Badge>
               <NavLink href="/full-registration/">Registration</NavLink>
              </Badge>
            </NavItem>}
            <NavItem>
              <NavLink href="">Info</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/jobs">Jobs</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="">Contact Us</NavLink>
            </NavItem>
          </Nav>
          {!AuthService.isSignedIn() && 
          <Link to='./login'>
            <Button className='custom-button'>
              Log In </Button>
          </Link>}
          {!AuthService.isSignedIn() && 
          <Link to='./register'>
            <Button className='custom-button'>
              Sign Up </Button>

          </Link>}
          {AuthService.isSignedIn() &&
            <NavbarText>Welcome {Auth.getUser()}!</NavbarText>
          }
          {AuthService.isSignedIn() &&
            <NavbarText style={{marginLeft:'30px'}}>
              <Link onClick={()=>{auth.signOut()}} to='/'>
                <Button className='custom-button'>
                  Log Out </Button>
              </Link>
            </NavbarText>

          }

        </Collapse>
      </Navbar>
    </div>
  );
}
export default NavbarComponent;

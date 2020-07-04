import RestUtilities from './RestUtilities';
import AuthStore from './../stores/Auth';

const REACT_APP_BASEURL = process.env.REACT_APP_BASEURL
export default class Auth {
    static isSignedIn() {
        // alert(!!AuthStore.getToken())
        return !!AuthStore.getToken();
    }

    signIn(data) {
        return RestUtilities.post(`${REACT_APP_BASEURL}/login/cms`, data)
            .then((response) => {
                // debugger
                if (!response.is_error) {
                    AuthStore.setToken(response.content.access_token);
                }
                return response;
            }).catch(error => {
                console.log("Login error: ", error);
            });
    }

    register(data) {
        return RestUtilities.post(`${REACT_APP_BASEURL}/registration/initial`, data)
            .then((response) => {
                debugger
                if (!response.is_error) {
                    AuthStore.setToken(response.content.access_token);
                }
                return response;
            });
    }

    confirm(token) {
        return RestUtilities.post('/api/auth/confirm', { token: token })
            .then((response) => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });
    }

    signOut() {
        AuthStore.removeToken();
        AuthStore.removeUser();
    }
}

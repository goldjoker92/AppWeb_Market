import * as Realm from "realm-web";
import { addUser, getUser } from "../../service";
import {app} from "../../service/mongoDB-sdk";
import {handleLogin,
        handleLogout,
        handleAuthentificationErrors,
      } from "../../state/actions/authentification";

const useAuthentication = (dispatch) => {
    function handleUserRegistration(newUser) {
      const userProfile = {
        first : newUser.first,
        last : newUser.last,
        email : newUser.email,
        city : newUser.city,
        country : newUser.country,
        gender : newUser.gender,
      };
      return new Promise((resolve) => {
        app.emailPasswordAuth
          .registerUser(newUser.email, newUser.password)
          .then(() => {
            const credentials = Realm.Credentials.emailPassword(
              newUser.email,
              newUser.password
            );
          
            app.logIn(credentials).then((user) => {
            addUser(userProfile);
            dispatch(handleLogin(userProfile));
           
          });
      })
      .catch((err) => dispatch(handleAuthentificationErrors(err))); 
    });

  }

  async function handleUserLogout () {
    console.log(app.currentUser);
    app.currentUser
    ?.logOut()
    .then(() =>{
      console.log("user succesfully log out");
    })
    .catch((err) => console.log(err));
  }

  async function handleUserLogin( email, password) {
    return new Promise((resolve) => {
     
      app.logIn(Realm.Credentials.emailPassword(email, password))
       .then(async() => {
         // Verify current user
        const currentUser = await app.currentUser;

        //retrieve user profile
        getUser(currentUser).then((userProfile) => {
             dispatch(handleLogin(userProfile));
               resolve(userProfile);
          });
        })
        .catch((err) => dispatch(handleAuthentificationErrors(err)));
       });
    }
  

  async function handleAuthentication() {
    const currentUser = await app.currentUser;
    dispatch(handleLogin(currentUser));
    getUser(currentUser?.email)
        .then(
          (userProfile) => !!currentUser && dispatch(handleLogin(userProfile))
        )
        .catch(err => dispatch(handleAuthentificationErrors(err)));
  }
    return {
      handleUserRegistration,
      handleUserLogout,
      handleUserLogin,
      handleAuthentication,
    };
  };
  export default useAuthentication;
   
  
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";


// get
export const getProducts = () => {
    return new Promise((OnSuccess, OnFail) => {
        axios.get("api/product")
        .then((response,error) =>{
            if(!response || error){
                return OnFail(`Response failure :${error} `);
            }
             OnSuccess(response);  
        })
        .catch((err) => OnFail(err));
    });       
};

export const getUser = body => {
    return new Promise((OnSuccess, OnFail) => {
        axios.get('/api/user', body.email)
        .then((response, error) =>{
            if(!response || error){
                return OnFail(`Response failure :${error} `);
            }
             OnSuccess(response.data);
        })
        .catch((err) => OnFail(err));
    })
}

//post
export const addUser = body => {
    return new Promise((OnSuccess, OnFail)=>{
        axios.post("/api/users/add", body).then((response, error)=> {
            if (!response || error) {
                return OnFail(`Response failure : ${error}`);
            }
            OnSuccess(`user profile successfully created`);
        })
        .catch((err) => OnFail(err));
    });
};

export const addOrder = body => {
    return new Promise((OnSuccess, OnFail) => {
        axios.get('/api/orders/add', body.email)
        .then((response, error) =>{
            if(!response || error){
                return OnFail(`Response failure :${error} `);
            }
             OnSuccess(response.data);
        })
        .catch((err) => OnFail(err));
    })
}




//stripe

export const processPayment = async (order) => {
    var stripePromise = loadStripe("pk_test_51IoTDrBIsrQJ9AiykcS7quqN6bIqPiNnERNzpSBOHXLiBWqLOWlZgCdo4NNGlGvO4Ubqi5AWDZHgdeEZIK2wuObA00jv1qsVOo");
    const stripe = await stripePromise;
    axios
    .post('api/create-checkout-session', order)
    .then((response) => {
        const sessionID = response.data.id;
        return stripe.redirectToCheckout({ sessionId: sessionID })
    })
};

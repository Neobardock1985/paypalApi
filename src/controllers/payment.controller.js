import axios from 'axios';
require('dotenv').config();

export const createOrder = async (req, res) => {
    try {
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: '100.00'
                    },
                    description: "orden de prueba",
                },
            ],
            application_context: {
                brand_name: "TicDeveloper.com",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: `${process.env.HOST}/capture-order`,
                cancel_url: `${process.env.HOST}/cancel-order`
            }
        };


        // Authentication with token
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        const { data: { access_token } } = await axios.post(
            `${process.env.PAYPAL_API}/v1/oauth2/token`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                    username: process.env.PAYPAL_API_CLIENT,
                    password: process.env.PAYPAL_API_SECRET,
                },
            }

        );

        console.log(access_token, "access_token");

        const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        console.log(response.data, "createOrder response");

        res.json(response.data);


        //Authentication with basic auth
        /*    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
               auth: {
                   username: process.env.PAYPAL_API_CLIENT,
                   password: process.env.PAYPAL_API_SECRET,
               },
           });
       
           console.log(response.data, "createOrder response");
       
           res.send('creating order'); */

    } catch (error) {
        return res.status(500).send("createOrder error ", error)
    }

}

export const captureOrder = async (req, res) => {

    const { token } = req.query;

    const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: process.env.PAYPAL_API_CLIENT,
            password: process.env.PAYPAL_API_SECRET,
        }
    });

    console.log(JSON.stringify(response.data), "captureOrder response")

    return res.redirect('/payed.html');
}

export const cancelOrder = (req, res) => {
    res.redirect('/');
}
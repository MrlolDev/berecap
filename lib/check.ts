import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useCheck() {

    let [checked, setChecked] = useState(false);
    function removeStorage() {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("uid");
        localStorage.removeItem("is_new_user");
        localStorage.removeItem("token_type");
        localStorage.removeItem("myself")
    }

    useEffect(() => {
        if (checked) {
            return;
        }
        setChecked(true);
        console.log("====================================")
        console.log("CHECKING STATE")

        let token = localStorage.getItem("token");
        let refresh_token = localStorage.getItem("refresh_token");
        let expiration = localStorage.getItem("expiration");
        let now = Date.now();
        console.log(token);
        console.log(refresh_token);
        console.log(expiration);
        console.log(now);

        if (token == null || expiration == null || refresh_token == null) {
            console.log("no token or expiration or refresh_token");
            removeStorage();
            if (window.location.pathname != "/") {
                window.location.href = "/";
            }
            return;
        } else {
            if (now > parseInt(expiration)) {
                console.log("token expired, attempting refresh");

                axios.request(
                    {
                        url: "/api/refresh",
                        method: "POST",
                        data: { refresh: refresh_token }
                    }
                ).then(
                    (response: any) => {
                        console.log(response.data);
                        if (response.data.status == "success") {
                            console.log("refresh success");
                            let token = response.data.token;
                            let refresh_token = response.data.refresh;
                            let expiration = response.data.expiration;

                            localStorage.setItem("token", token);
                            localStorage.setItem("refresh_token", refresh_token);
                            localStorage.setItem("expiration", expiration);

                            console.log("refreshing page");

                        } else {
                            console.log("refresh error");
                            removeStorage();
                            if (window.location.pathname != "/") {
                                window.location.href = "/";
                            }
                            return;
                        }
                    }).catch(
                        (error: any) => {
                            console.log("refresh fetch error");
                            console.log(error);
                            removeStorage();
                            if (window.location.pathname != "/") {
                                window.location.href = "/";
                            } return;
                        }
                    )
            }
        }

        console.log("token is valid");


        if (window.location.pathname == "/") {
            window.location.href = "/feed";

        }

        console.log("====================================")
    }, [])

    return true;
}
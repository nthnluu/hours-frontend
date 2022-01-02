import Navbar from "../components/shared/Navbar";
import AccountMenu from "../components/shared/AccountMenu";
import {testUser} from "../util/auth/auth_helpers";
import React, { useEffect } from "react";
import Button from "../components/shared/Button";
import {useAuth} from "../util/firebase_auth_helpers";

function AccountButton() {
    return <AccountMenu key="account" user={testUser()}/>;
}

export default function Home() {
    const session = useAuth();

    useEffect(() => {
        session.signInWithGoogle()
            .then(res => {
                res.email;
            });
    }, []);
    return (
        <div>
            <Navbar endItems={[<AccountButton key="account"/>]}/>
            <Button>Shee</Button>

            {JSON.stringify(session)}
        </div>
    );
}

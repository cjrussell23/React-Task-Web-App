import React from 'react'

function SignOut(props) {
    const { auth } = props;
    return (
        <button className="sign-out btn btn-secondary" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

export default SignOut;

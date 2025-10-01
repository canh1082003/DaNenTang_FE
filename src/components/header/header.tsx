import React from 'react'

export default function Header() {
    const userInfo = localStorage.getItem("userInfo");
    const user = userInfo ? JSON.parse(userInfo) : null;
    console.log(user)
    return (
        <div>
            {user?.username}
        </div>
    )
}

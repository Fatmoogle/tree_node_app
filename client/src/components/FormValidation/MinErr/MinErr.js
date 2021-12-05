import React from 'react'

export default function MinErr({ min }) {

    let minErrMsg = "You cannot pick a number less than 0";

    return (
        <span>{min < 0 ? minErrMsg : <div></div>}</span>
    )
}


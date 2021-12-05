import React from 'react'

export default function ChildrenErr({ children }) {

    let childrenErrMsg = "Please pick a number between 1 and 15";

    return (
        <span>{children < 1 || children > 15 ? childrenErrMsg : <div></div>}</span>
    )
}

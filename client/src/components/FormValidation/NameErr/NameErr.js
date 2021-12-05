import React from 'react'

export default function NameErr({ name }) {

    let nameErrMsg = "Please enter a name for your factory";

    return (
        <span>{name.trim() < 1 ? nameErrMsg : <div></div>}</span>
    )
}

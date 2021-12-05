import React from 'react'

export default function MaxErr({ min, max }) {

    let maxErrMsg = "Your max must be greater than your min";

    return (
        <span>{max <= min ? maxErrMsg : <div></div>}</span>
    )
}
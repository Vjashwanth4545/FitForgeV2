import React from 'react'
import BMINavbar from './BMInavbar'
import "./BMI.css"
import BMIbody from './BMIbody'
import BMIFooter from './BMIFooter'

const BMI = ({username}) => {
  return (
    <>
    <BMINavbar />
    <BMIbody username={username} />
    <BMIFooter />
    </>
  )
}

export default BMI

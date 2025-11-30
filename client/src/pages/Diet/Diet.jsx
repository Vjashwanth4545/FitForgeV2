import React from 'react'
import "./Diet.css"
import DietNavbar from './Dietnavbar'
import DietFooter from './DietFooter'
import DietBody from './DietBody'
const Diet = ({username}) => {
  return (
    <>
    <DietNavbar />
    <DietBody username={username}/>
    <DietFooter />
    </>
  )
}

export default Diet

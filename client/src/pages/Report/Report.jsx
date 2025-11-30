import React from 'react'
import "./Report.css"
import ReportNavbar from './Reportnavbar'
import ReportFooter from './ReportFooter'
import ReportBody from './ReportBody'

const Report = ({username}) => {
  return (
    <>
    <ReportNavbar />
    <ReportBody username={username}/>
    <ReportFooter />
    </>
  )
}

export default Report;

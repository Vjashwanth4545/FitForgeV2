import React from 'react'
import WorkoutNavbar from './Workoutnavbar'
import "./Workout.css"
import WorkoutFooter from './WorkoutFooter'
import WorkoutPlanner from './WorkoutBody'

const Workout = ({username}) => {
  return (
    <>
    <WorkoutNavbar />
    <WorkoutPlanner username={username} />
    <WorkoutFooter />
    </>
  )
}

export default Workout

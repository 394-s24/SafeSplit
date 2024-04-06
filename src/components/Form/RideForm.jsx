import React from 'react'
import { Button } from 'react-bootstrap'
import { db } from '../../FireBase'
import { ref, onValue } from "firebase/database";


const RideForm = ({currMaxId}) => {

    const dbRef = ref(db);
    // set(ref(dbRef, 'requests'), 
    // {})

    console.log(currMaxId)

    function runAlgorithm () {
        console.log("Running Algorithm")
        preventDefault()
    }

  return (
    <form onSubmit = {runAlgorithm}>
         <Button variant="light" type = "submit">Light</Button>{' '}
    </form>
    
  )

}

export default RideForm
import React, { useState, useEffect } from 'react'

export default function Test() {

    const [test, setTest] = useState(0)
    const [a, setA] = useState({'a':'idk', 'b':'ppkpk'})

    const handleTest = (() => {
        console.log('test', test)
        setTest(test => test + 1);
    })

    useEffect(() => {
      console.log('side')
    }, [a])
    

    return (
        <>
            <button className='btn' onClick={handleTest}>abc</button>
        </>)
}

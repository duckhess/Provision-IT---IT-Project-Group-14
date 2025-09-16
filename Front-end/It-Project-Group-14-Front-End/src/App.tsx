import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './BasicSummary.tsx'
import Summary from './BasicSummary.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Summary/>
    </div>
  )
}

export default App

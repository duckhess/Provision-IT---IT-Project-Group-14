import { useState } from 'react'
import Summary from './components/BasicSummary.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Summary/>
    </div>
  )
}

export default App

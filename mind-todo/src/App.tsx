import { useState } from 'react'
import { FaBrain, FaPlus } from 'react-icons/fa'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="header">
        <div className="header-logo">
          <FaBrain size={24} />
          <span>Mind-Todo</span>
        </div>
        <div className="header-actions">
          <button className="primary-btn" onClick={() => setCount(count + 1)}>
            <FaPlus size={14} style={{ marginRight: '6px' }} />
            New Mind Map ({count})
          </button>
        </div>
      </header>
      <div className="main-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Tasks</h2>
          </div>
          <div className="sidebar-content">
            <p>Task list will appear here</p>
          </div>
        </div>
        <div className="mind-map-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column'
          }}>
            <h2>Mind Map Canvas</h2>
            <p>Mind map will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

// App.jsx
import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom" // Remove BrowserRouter import
import { supabase } from ".././SupabaseClient"
import Home from ".././src/Components/Home/Home"
import MovieDetails from "./Components/MovieDetails"
import SeatSelection from "./Components/SeatSelection"
import "./assets/styles/global.css"

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading LuvToWatch...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home session={session} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/seats/:id" element={<SeatSelection session={session} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
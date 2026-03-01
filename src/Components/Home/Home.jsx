import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../../SupabaseClient"
import styles from "./Home.module.css"
import { movies as movieList } from "../../moviesData"

const Home = ({ session }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [movies, setMovies] = useState(movieList)

  useEffect(() => {
    if (session) {
      setUser(session.user)
    }
  }, [session])

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } })
  }

  const Signin = async() => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          prompt: 'select_account',
          response_mode: 'query',
        },
      },
    })
  }

  const SignOut = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
    setUser(null)
  }

  return (
    <main className={styles.homeCard}>
      <div className={styles.topBar}>
        <div className={styles.brandTag} onClick={() => navigate('/')}>
          <i className="fas fa-crown"></i>
          <span>LuvToWatch</span>
        </div>
        
        {user ? (
          <div className={styles.userProfile}>
            <div 
              className={styles.userAvatar} 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="User" 
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {showDropdown && (
              <div className={styles.userDropdown}>
                <div className={styles.userEmail}>{user.email}</div>
                <button onClick={SignOut} className={styles.signoutBtn}>
                  <i className="fas fa-sign-out-alt"></i> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.actionButtons}>
            <button onClick={Signin} className={styles.btnGoogle}>
              <i className="fab fa-google"></i> Sign in with Google
            </button>
          </div>
        )}
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}><i className="fas fa-shield-alt"></i></div>
          <div className={styles.infoText}>
            <h4>secure booking</h4>
            <p>end-to-end encrypted · safe & trusted</p>
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}><i className="fas fa-credit-card"></i></div>
          <div className={styles.infoText}>
            <h4>wide payment methods</h4>
            <p>cards, UPI, wallets, BNPL + crypto</p>
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}><i className="fas fa-film"></i></div>
          <div className={styles.infoText}>
            <h4>cinema partner</h4>
            <p>real‑time seat select · 100+ theaters</p>
          </div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>🎬 New Movies</h2>
      
      <div className={styles.moviesGrid}>
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className={styles.movieCard}
            onClick={() => handleMovieClick(movie)}
          >
            <div 
              className={styles.moviePoster}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(${movie.bgImage})`
              }}
            >
              <div className={styles.movieRating}>
                <i className="fas fa-star"></i>
                <span>{movie.rating}</span>
              </div>
              <div className={styles.moviePrice}>₹{movie.price}</div>
            </div>
            <div className={styles.movieInfo}>
              <h3>{movie.title}</h3>
              <p>{movie.genre}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footNote}>
        <i className="fas fa-check-circle"></i> 256‑bit secure · 20+ payment options · 
        <i className="fas fa-heart" style={{ color: "#ff7e5f" }}></i> LuvToWatch
      </div>
    </main>
  )
}

export default Home
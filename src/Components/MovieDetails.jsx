import React from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import styles from "./MovieDetails.module.css"
import { movies } from "../moviesData"


const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  // prefer object passed through navigation, otherwise lookup
  let movie = location.state?.movie
  if (!movie) {
    movie = movies.find(m => m.id === parseInt(id))
  }
  if (!movie) {
    navigate('/')
    return null
  }



  const handleBookNow = () => {
    navigate(`/seats/${id}`, { state: { movie } })
  }

  return (
    <div className={styles.movieDetailsContainer}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className={styles.movieDetailsCard}>
        <div 
          className={styles.movieDetailsPoster}
          style={{
            backgroundImage: `url(${movie.bgImage})`
          }}
        >
          <div className={styles.posterOverlay}></div>
        </div>

        <div className={styles.movieDetailsInfo}>
          <h1>{movie.title}</h1>
          
          <div className={styles.movieMeta}>
            <span className={styles.metaItem}>
              <i className="fas fa-star"></i> {movie.rating}/10
            </span>
            <span className={styles.metaItem}>
              <i className="fas fa-clock"></i> {movie.duration}
            </span>
            <span className={styles.metaItem}>
              <i className="fas fa-language"></i> {movie.language}
            </span>
          </div>

          <div className={styles.movieGenreTags}>
            {movie.genre.split('·').map((g, i) => (
              <span key={i} className={styles.genreTag}>{g.trim()}</span>
            ))}
          </div>

          <p className={styles.movieDescription}>{movie.description}</p>

          <div className={styles.moviePriceSection}>
            <div className={styles.priceDetail}>
              <span>Ticket Price:</span>
              <span className={styles.priceAmount}>₹{movie.price}</span>
            </div>
            <button className={styles.bookNowBtn} onClick={handleBookNow}>
              Book Now <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
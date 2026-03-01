import React, { useState } from "react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import styles from "./SeatSelection.module.css"
import axios from "axios"
import { movies } from "../moviesData"

const SeatSelection = ({ session }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  let movie = location.state?.movie
  if (!movie) {
    movie = movies.find(m => m.id === parseInt(id))
  }
  if (!movie) {
    navigate('/')
    return null
  }
  const [loading, setLoading] = useState(false)

  const [selectedSeats, setSelectedSeats] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)

  // Ensure movie price is a number
  const ticketPrice = movie ? Number(movie.price) : 0

  // Generate seats (10 rows, 12 seats per row)
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const seats = []
    
    rows.forEach(row => {
      for (let i = 1; i <= 12; i++) {
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          isBooked: Math.random() > 0.7, // Randomly book some seats
          isSelected: false
        })
      }
    })
    
    return seats
  }

  const [seats, setSeats] = useState(generateSeats())

  const handleSeatClick = (seatId) => {
    // First, check if the seat is already selected
    const seat = seats.find(s => s.id === seatId)
    if (!seat || seat.isBooked) return

    const isCurrentlySelected = seat.isSelected
    
    // Update seats UI
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId 
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    )

    // Update selected seats array based on current selection
    if (!isCurrentlySelected) {
      // Adding seat - store as object with id, row, and number
      setSelectedSeats(prev => {
        const seatObject = {
          id: seatId,
          row: seat.row,
          number: seat.number
        }
        const newSelectedSeats = [...prev, seatObject]
        // Update total price based on new count
        setTotalPrice(ticketPrice * newSelectedSeats.length)
        return newSelectedSeats
      })
    } else {
      // Removing seat
      setSelectedSeats(prev => {
        const newSelectedSeats = prev.filter(s => s.id !== seatId)
        // Update total price based on new count
        setTotalPrice(ticketPrice * newSelectedSeats.length)
        return newSelectedSeats
      })
    }
  }

  // Create ticket data JSON
  const createTicketData = () => {
    return [
      {
        id: movie.id,
        ticketprice:totalPrice,
        priceincents: totalPrice * 100, // Convert to cents for payment
        name: movie.title,
        quantity: selectedSeats.length,
        image: movie.bgImage,
        seats: selectedSeats, // Array of seat objects
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '/'),
        time: "7:30 PM"
      }
    ]
  }

  // Connection with the Backend
  const getTicket = async() => {
    if (!session?.user?.email) {
      alert("Please sign in to continue booking")
      navigate('/')
      return
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat")
      return
    }

    setLoading(true)
    
    try {
      const ticketData = createTicketData()
      const userEmail = session.user.email
      
      console.log("Sending ticket data:", JSON.stringify({ data: ticketData, email: userEmail }, null, 2))
      
      const response = await axios.post(
        "http://localhost:5000/ticket",
        {
          data: ticketData,
          email: userEmail
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      
      if (response.status === 200 || response.status === 201) {
        let { url } = response.data
        if (url) {
          window.location.href = url
        } else {
          // If no URL returned, show success and redirect
          alert("✅ Booking successful! Check your email for confirmation.")
          setTimeout(() => navigate('/'), 2000)
        }
      }
    } catch(err) {
      console.error("Booking error:", err)
      alert("❌ Failed to book tickets. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!movie) {
    navigate('/')
    return null
  }

  // Helper function to display selected seats in the summary
  const displaySelectedSeats = () => {
    if (selectedSeats.length === 0) return 'None'
    return selectedSeats.map(seat => seat.id).join(', ')
  }

  return (
    <div className={styles.seatSelectionContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className={styles.seatSelectionCard}>
        <h2>Select Seats for {movie.title}</h2>
        
        <div className={styles.movieInfoBar}>
          <img src={movie.bgImage} alt={movie.title} className={styles.movieThumbnail} />
          <div className={styles.movieInfoDetails}>
            <h3>{movie.title}</h3>
            <p>{movie.genre}</p>
            <p className={styles.ticketPrice}>₹{ticketPrice} per ticket</p>
          </div>
        </div>

        <div className={styles.screenContainer}>
          <div className={styles.screen}>SCREEN</div>
        </div>

        <div className={styles.seatsGrid}>
          {seats.map((seat) => (
            <button
              key={seat.id}
              className={`${styles.seat} ${seat.isBooked ? styles.booked : ''} ${seat.isSelected ? styles.selected : ''}`}
              onClick={() => handleSeatClick(seat.id)}
              disabled={seat.isBooked || loading}
            >
              {seat.id}
            </button>
          ))}
        </div>

        <div className={styles.seatLegend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.available}`}></div>
            <span>Available</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.selected}`}></div>
            <span>Selected</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.booked}`}></div>
            <span>Booked</span>
          </div>
        </div>

        <div className={styles.bookingSummary}>
          <div className={styles.summaryDetails}>
            <h3>Booking Summary</h3>
            <div className={styles.summaryRow}>
              <span>Selected Seats:</span>
              <span>{displaySelectedSeats()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Price per ticket:</span>
              <span>₹{ticketPrice}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Number of Seats:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total Amount:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
          
          <button 
            className={styles.continueBtn}
            disabled={selectedSeats.length === 0 || loading}
            onClick={getTicket}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              'Continue Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
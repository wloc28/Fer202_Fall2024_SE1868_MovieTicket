import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Header from '../components/Header';
import { getMovieById } from '../api/movie-api';
import { createBooking } from '../api/booking-api';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [seats, setSeats] = useState(1);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await getMovieById(id);
      setMovie(movieData);
    };
    
    fetchMovie();
  }, [id]);

  const handleBooking = async () => {
    const booking = {
      userId,
      movieId: id,
      bookingDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      bookingTime: new Date().toISOString().split('T')[1].substring(0, 5), // Current time in HH:MM format
      seats
    };

    try {
      await createBooking(booking);
      alert(`You have successfully booked ${seats} seats for ${movie.name}`);
      navigate(`/your-booking/${userId}`);
    } catch (error) {
      console.error(error);
      alert('An error occurred while booking. Please try again.');
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Container className="my-5">
        <Row>
          <Col md={4}>
            <img src={movie.imageUrl} alt={movie.name} className="img-fluid rounded" />
          </Col>
          <Col md={8}>
            <h1>{movie.name}</h1>
            <p>Directed by: {movie.director}</p>
            <p>Year: {movie.year}</p>
            <p>Genre: {movie.genre}</p>
            <p>{movie.description}</p>
            
              {
                userId ? (
                  <Form className="mt-4">
              <Form.Group as={Row} controlId="formSeats">
                <Form.Label column sm="2">Seats</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    type="number" 
                    value={seats} 
                    onChange={(e) => setSeats(e.target.value)} 
                    min="1" 
                    max="10" 
                  />
                </Col>
              </Form.Group>
                  <Button variant="primary" onClick={handleBooking} className="mt-3">
                    Book Now
                  </Button>
                  </Form>
                ) : (
                  <Button variant="primary" onClick={() => navigate("/login")}>Login to book</Button>
                )
              }
            
          </Col>
        </Row>
      </Container>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { getMovieById } from '../api/movie-api';
import { getBookingByUserId } from '../api/booking-api';
import Header from '../components/Header';
import { deleteBooking } from '../api/booking-api';


export default function YourBooking() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingData = await getBookingByUserId(id);
      console.log(bookingData);
      setBookings(bookingData);

      // Fetch corresponding movie details
      const movieDetails = await Promise.all(
        bookingData.map(booking => getMovieById(booking.movieId))
      );
      const movieDetailsMap = movieDetails.reduce((acc, movie) => {
        acc[movie.id] = movie;
        return acc;
      }, {});
      setMovies(movieDetailsMap);
    };

    fetchBookings();
  }, [id]);
  const handleDelete = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to delete this booking?");
    if (confirmed) {
      const success = await deleteBooking(bookingId);
      if (success) {
        // Xóa booking khỏi UI
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        alert("Booking deleted successfully");
      } else {
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5">
        <h1 className="mb-4">Your Bookings</h1>
        <Row>
          {bookings.map((booking, index) => (
            <Col md={6} key={booking.id} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      {movies[booking.movieId] && (
                        <img
                          src={movies[booking.movieId].imageUrl}
                          alt={movies[booking.movieId].name}
                          className="img-fluid rounded booking-img"
                          style={{ height: "100%", objectFit: "cover" }}
                        />
                      )}
                    </Col>
                    <Col md={8}>
                      {movies[booking.movieId] && (
                        <>
                          <Card.Title className="h3">{movies[booking.movieId].name}</Card.Title>
                          <Card.Text className="h5">Directed by: {movies[booking.movieId].director}</Card.Text>
                          <Card.Text className="h5">Year: {movies[booking.movieId].year}</Card.Text>
                          <Card.Text className="h5">Genre: {movies[booking.movieId].genre}</Card.Text>
                        </>
                      )}
                      <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item><strong>Booking Date:</strong> {booking.bookingDate}</ListGroup.Item>
                        <ListGroup.Item><strong>Booking Time:</strong> {booking.bookingTime}</ListGroup.Item>
                        <ListGroup.Item><strong>Seats:</strong> {booking.seats}</ListGroup.Item>
                      </ListGroup>
                      <button
                        className="btn btn-danger mt-3"
                        onClick={() => handleDelete(booking.id)}
                      >
                        Delete 
                      </button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

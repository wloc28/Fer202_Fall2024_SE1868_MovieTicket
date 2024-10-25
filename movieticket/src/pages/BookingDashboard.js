import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../api/booking-api';
import DashboardHeader from '../components/DashboardHeader';

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({ id: '', userId: '', movieId: '', bookingDate: '', bookingTime: '', seats: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsData = await getBookings();
      setBookings(bookingsData);
    };

    fetchBookings();
  }, []);

  const handleShowModal = (booking = { id: '', userId: '', movieId: '', bookingDate: '', bookingTime: '', seats: '' }) => {
    setCurrentBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBooking((prevBooking) => ({ ...prevBooking, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentBooking.id) {
      await updateBooking(currentBooking.id, currentBooking);
    } else {
      await createBooking(currentBooking);
    }
    const bookingsData = await getBookings();
    setBookings(bookingsData);
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await deleteBooking(id);
    const bookingsData = await getBookings();
    setBookings(bookingsData);
  };

  return (
    <div className='container'>
      <DashboardHeader />
      <Container fluid className="my-5">
        <h1 className="mb-4">Booking Dashboard</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>Add Booking</Button>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Movie ID</th>
              <th>Booking Date</th>
              <th>Booking Time</th>
              <th>Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.userId}</td>
                <td>{booking.movieId}</td>
                <td>{booking.bookingDate}</td>
                <td>{booking.bookingTime}</td>
                <td>{booking.seats}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(booking)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(booking.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{currentBooking.id ? 'Edit Booking' : 'Add Booking'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  name="userId"
                  value={currentBooking.userId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Movie ID</Form.Label>
                <Form.Control
                  type="text"
                  name="movieId"
                  value={currentBooking.movieId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Booking Date</Form.Label>
                <Form.Control
                  type="date"
                  name="bookingDate"
                  value={currentBooking.bookingDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Booking Time</Form.Label>
                <Form.Control
                  type="time"
                  name="bookingTime"
                  value={currentBooking.bookingTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Seats</Form.Label>
                <Form.Control
                  type="number"
                  name="seats"
                  value={currentBooking.seats}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {currentBooking.id ? 'Update Booking' : 'Add Booking'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal, Image } from 'react-bootstrap';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../api/movie-api';
import DashboardHeader from '../components/DashboardHeader';

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({ id: '', name: '', year: '', director: '', genre: '', imageUrl: '' });

  useEffect(() => {
    const fetchMovies = async () => {
      const moviesData = await getMovies();
      setMovies(moviesData);
    };

    fetchMovies();
  }, []);

  const handleShowModal = (movie = { id: '', name: '', year: '', director: '', genre: '', imageUrl: '' }) => {
    setCurrentMovie(movie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentMovie.id) {
      await updateMovie(currentMovie.id, currentMovie);
    } else {
      await createMovie(currentMovie);
    }
    const moviesData = await getMovies();
    setMovies(moviesData);
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await deleteMovie(id);
    const moviesData = await getMovies();
    setMovies(moviesData);
  };

  return (
    <div className='container'>
      <DashboardHeader />
      <Container fluid className="my-5">
        <h1 className="mb-4">Movie Dashboard</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>Add Movie</Button>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Year</th>
              <th>Director</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>
                  <Image src={movie.imageUrl} rounded style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </td>
                <td>{movie.name}</td>
                <td>{movie.year}</td>
                <td>{movie.director}</td>
                <td>{movie.genre}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(movie)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(movie.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{currentMovie.id ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentMovie.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="text"
                  name="year"
                  value={currentMovie.year}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Director</Form.Label>
                <Form.Control
                  type="text"
                  name="director"
                  value={currentMovie.director}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={currentMovie.genre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="imageUrl"
                  value={currentMovie.imageUrl}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {currentMovie.id ? 'Update Movie' : 'Add Movie'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

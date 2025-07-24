import React from 'react';
import { Card, Button } from 'react-bootstrap';
const AdCard = () => (
  <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src="path/to/image.jpg" />
    <Card.Body>
      <Card.Title>Adayar L B Road towards Thiruvanmiyur</Card.Title>
      <Card.Text>₹1,20,000</Card.Text>
      <Button variant="primary">Book Now</Button>
    </Card.Body>
  </Card>);
export default AdCard;

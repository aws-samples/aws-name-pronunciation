import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

import Home from "./pages/Home";
import Architecture from "./pages/Architecture";

import './index.css';
//import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
  return (
    <>

    <div id="body">
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="/">Name Pronunciation Tool</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/architecture">Architecture</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </div>
    </>
  )
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="share" element={<Home />} />
          <Route path="architecture" element={<Architecture />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

import ModalsProvider from "../providers/ModalsProvider";
import ToasterProvider from "../providers/ToasterProvider";
import ToursPage from "../components/tours/ToursPage";
import Navbar from "../components/navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TourPage from "../components/tours/[tourId]/page";

import { Container } from '@mui/material';

const App = () => {
  return (
    <div className="App">
      <ToasterProvider />
      <ModalsProvider />
      <Navbar />

      <Container maxWidth={'lg'}>
        <Router>
          <Routes>
            <Route path="/" element={<ToursPage />} />
            <Route path="/tours/:id" element={<TourPage />} />
          </Routes>
        </Router>
      </Container>
    </div>
  );
}

export default App;

import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { GlobalStyle } from "../styles";

// Hooks
import { useAppDispatch } from "./reduxHooks";
import { useAuthVerification } from "../hooks/auth/useAuthVerification";

// Redux
import { setUserFromLocalStorage } from "../redux/slices/userSlice";

// Providers
import ModalsProvider from "../providers/ModalsProvider";
import ToasterProvider from "../providers/ToasterProvider";

// Components
import NavBar from "../components/layout/NavigationBar";
import Footer from "../components/layout/Footer";

// Routing
import routeConfig from "../config/routeConfig";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAuthVerification();

  useEffect(() => {
    if (user) {
      dispatch(setUserFromLocalStorage(user));
    }
  }, [user, dispatch]);

  return (
    <div>
      <GlobalStyle />
      <ToasterProvider />
      <ModalsProvider />

      <Router>
        <NavBar />
        <Container>
          <Routes>
            {routeConfig.map(({ path, component: Component, requiredRoles }) =>
              requiredRoles.length > 0 ? (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute requiredRoles={requiredRoles}>
                      {<Component />}
                    </ProtectedRoute>
                  }
                />
              ) : (
                <Route key={path} path={path} element={<Component />} />
              )
            )}
          </Routes>
        </Container>
        <Footer />
      </Router>
    </div>
  );
};

export default App;

import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// react-router-dom v6
const PrivateRoute = ({ children, ...rest }) => {
    const { user } = useContext(AuthContext);
    console.log("Private Route works!");
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

// ProtectedRoute.jsx

import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const getUserData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
          setIsLoading(true);
        } catch (error) {
          setIsLoading(false);
          console.error("Error fetching user data:", error);
        }
      };
      getUserData();
    }
  }, []);

  const location = useLocation();
  console.log(user, isLoading);
  if (isLoading) {
    console.log("okk");
    if (!user) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    } else {
      return <Outlet />;
    }
  }
};

export default ProtectedRoute;

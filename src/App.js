import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Index from "./Components/Sidebar.jsx";
import NewGuide from "./pages/NewGuide.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import CourseRoadMap from "./Components/RoadMap/CourseRoadMap.jsx";
import StudyGuide from "./Components/StuyGuide/StudyGuide.jsx";
import axios from "axios";
import Guides from "./Components/Guides/Guides.jsx";
import { useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
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
        } catch (error) {
          console.error("Error fetching user data:", error);
          navigate("/login");
        }
      };
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <Box>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<Index />}>
          <Route path="/" element={<Guides />}></Route>
          <Route path="/new-guide" element={<NewGuide />}></Route>
          <Route path="/roadmap/:courseId" element={<CourseRoadMap />}></Route>
          <Route path="/study-guide/:lessonId" element={<StudyGuide />}></Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;

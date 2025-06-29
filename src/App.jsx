import { BrowserRouter ,Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import PrivateRoute from "./Components/PrivateRoute"
import AdminDashboard from "./Pages/AdminDashboard";
import FacultyDashboard from "./Pages/FacultyDashboard";
import StudentDashboard from "./Pages/StudentDashboard";

function App() {
  

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path= "login" element={<Home/>}></Route>
    <Route path="/admin" element={<PrivateRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></PrivateRoute>}/>
    <Route path="/faculty" element={<PrivateRoute allowedRoles={['ROLE_FACULTY']}><FacultyDashboard /></PrivateRoute>}/>
    <Route path="/student" element={<PrivateRoute allowedRoles={['ROLE_STUDENT']}><StudentDashboard /></PrivateRoute>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App

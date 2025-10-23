import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavigationBar/NavBar";
import Footer from "./Footer/Footer";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import ComparePage from "./pages/ComparePage";
import LoginPage from "./pages/LoginPage";
import BusinessPage from "./pages/BusinessPage";

function App() {
  return (
    <Router>
      <div className="bg-[#f7f7f7] flex flex-col">
        <NavBar />

        <main className="min-h-screen w-screen mx-auto mt-6 px-4">

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/business/:companyId" element={<BusinessPage />} /> {/*for dynamic routing*/}


          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
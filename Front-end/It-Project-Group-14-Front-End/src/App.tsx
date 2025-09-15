
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import ComparePage from './pages/ComparePage';


function App() {
  return (
    <Router>
        <div className='min-h-screen bg-grey-800'>
            <NavBar/>

            <main className='max-w-6xl mx-auto mt-6 -4'>
                <Routes>
                    <Route path='/' element= {<HomePage/>}/>
                    <Route path='/' element= {<SearchPage/>}/>
                    <Route path='/' element= {<ProfilePage/>}/>
                    <Route path='/' element= {<ComparePage/>}/>
                </Routes>
            </main>
        </div>
    </Router>
  );
}

export default App
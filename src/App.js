import './App.css';
import Header from './Components/Header/Header';
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import Authentication from './Components/Authentication/Authentication';
import { ToastContainer, Zoom } from 'react-toastify';
import Homepage from './Pages/Homepage/Homepage';
import BookmarksPage from './Pages/Bookmarks/BookmarksPage';
import AddStory from './Components/AddStory/AddStory';
import SharedStory from './Components/SharedStory/SharedStory';
import MyStories from './Components/MyStories/MyStories';

function App() {
  const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return (
      isAuthenticated ? <Outlet /> : <Navigate to='/login' />
    )
  }
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/add-story' element={<AddStory />} />
          <Route path='/bookmarks' element={<BookmarksPage />} />
          <Route path='/my-stories' element={<MyStories/>}/>
        </Route>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Authentication type={'login'} />} />
        <Route path='/register' element={<Authentication type={'register'} />} />
        <Route path='/shared/:storyId' element={<SharedStory />} />
      </Routes>
      <ToastContainer transition={Zoom} autoClose={1500} />
    </div>
  );
}

export default App;

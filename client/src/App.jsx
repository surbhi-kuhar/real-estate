import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Listing from "./pages/Listing";
import UpdateListing from "./pages/UpdateListing";
import ViewListing from "./pages/ViewListing";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/search" element={<Search/>}/>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<Listing />} />
          <Route
            path="/update-listing/:listingID"
            element={<UpdateListing />}
          />
        </Route>
        <Route path="/view-listing/:listingID" element={<ViewListing />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

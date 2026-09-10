import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Feed from "./components/Feed";
import PetForm from "./components/PetForm";
import FosterApplication from "./components/FosterApplication";
import AdopterApplication from "./components/AdopterApplication";
import UserFeed from "./components/UserFeed";
import PetDetail from "./components/PetDetail";
import UserProfile from "./components/UserProfile";
import ShelterProfile from "./components/ShelterProfile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Chat from "./components/Chat";
import Messages from "./components/Messages";
function App() {
  return (
    <BrowserRouter>
      <Routes>

   
        <Route path="/" element={<Body />}>

          <Route index element={<Home />} />

          <Route path="login" element={<Login />} />

          <Route path="signup" element={<SignUp />} />

          <Route path="feed" element={<Feed />} />

        <Route path="/petdetails/:id" element={<PetDetail />} />
         
          <Route path="fosterapplication/:id"  element={<FosterApplication />} />

          <Route path="adoptionapplication/:id" element={<AdopterApplication />}/>

          <Route path="shelter/profile"  element={<ShelterProfile />} />

          <Route path="profile" element={<UserProfile />} />

          <Route path="userfeed" element={<UserFeed />} />

        
<Route path="messages" element={<Messages/>} />
<Route path="/chat/:petId/:userId" element={<Chat />} />
<Route path="/petform" element={<PetForm />} />

<Route path="/petform/:id" element={<PetForm />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
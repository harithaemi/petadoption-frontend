import React, { useEffect, useState } from "react";
import axios from "axios";
import Dog from "../assets/dog.png";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7777/profile",
          {
            withCredentials: true,
          }
        );

        console.log("Navbar profile:", response.data);

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Profile error:",
          error.response?.data || error.message
        );

        setUser(null);
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:7777/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);

      navigate("/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );
    }
  };

  const profilePath =
    user?.role === "shelter"
      ? "/shelter/profile"
      : user?.role === "adopter"
      ? "/adoption/profile"
      : "/login";

  return (
    <div className="navbar bg-base-100 shadow justify-between z-50 fixed top-0 w-full">

      {/* LOGO */}

      <Link
        to={
          user?.role === "shelter"
            ? "/feed"
            : "/userfeed"
        }
        className="flex gap-3 m-4 items-center"
      >
        <img
          src={Dog}
          className="w-10 h-auto"
          alt="PetLover"
        />

        <h1 className="font-righteous font-medium text-3xl">
          PetLover
        </h1>
      </Link>

      {/* USER MENU */}

      {user && (

        <div className="dropdown dropdown-end mr-4">

          <div
            tabIndex={0}
            role="button"
            className="p-2 shadow rounded-full bg-red-600 w-10 h-10 cursor-pointer flex items-center justify-center"
          >
            <h1 className="text-white font-semibold">
              {user.userName
                ?.charAt(0)
                .toUpperCase()}
            </h1>
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >

            {/* PROFILE */}

            <li>
              <Link to={profilePath}>
                Profile
              </Link>
            </li>

            {/* MESSAGES */}

            <li>
              <Link to="/messages">
                Messages
              </Link>
            </li>

            {/* LOGOUT */}

            <li>
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>

          </ul>

        </div>

      )}

    </div>
  );
};

export default NavBar;

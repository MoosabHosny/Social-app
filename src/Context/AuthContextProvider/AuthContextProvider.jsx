import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const tokenContext = createContext();

export default function AuthContextProvider({ children }) {
  // const [token, setToken] = useState(localStorage.getItem('token'));

  const [userData, setUserData] = useState(function () {
    return getUserData();
  });
  const [token, setToken] = useState(function () {
    return localStorage.getItem("token");
  });
  async function getUserData() {
    try {
      const response = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

        //   console.log("response",response.data.data.user);
        setUserData(response.data.data.user )
      return response.data.data.user;
    } catch (error) {
        console.error("Error fetching data:", error);
        setUserData(null)
        return null;
    }
  }

  function setUserToken() {
    setToken(localStorage.getItem("token"));
  }
  return (
    <tokenContext.Provider value={{ setUserToken,userData,getUserData }}>
      {children}
    </tokenContext.Provider>
  );
}


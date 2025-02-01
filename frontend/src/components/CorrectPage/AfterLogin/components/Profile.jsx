import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { warning } from "./Images/image";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get the userId from URL query string
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("profile");

  // Get the userId from localStorage (assuming it's stored in userData)
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const currentUserId = storedUserData ? storedUserData._id : null;

  useEffect(() => {
    if (userId) {
      // Fetch user data based on userId
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:5000/user/${userId}`
          );
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userData ? (
        <div className="Profile">
          {/* <h2>Profile of {userData.name}</h2>
          <p>Email: {userData.email}</p>
          <p>Points: {userData.points}</p>

          {userId === currentUserId && (
            <p>
              <strong>This is you!</strong>
            </p>
          )}

          Add more user data as needed */}

          <img src={warning} alt="" />

          <p>Work in progress !!!</p>
        </div>
      ) : (
        <div>No user found</div>
      )}
    </>
  );
};

export default Profile;

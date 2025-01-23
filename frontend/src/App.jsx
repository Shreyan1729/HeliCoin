import React, { useEffect, useState } from "react";

import "./assets/style/App.css";
import BeforeLogin from "./components/BeforeLogin";
import AfterLogin from "./components/AfterLogin";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser("user");
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div className="App">
      {user === null && <BeforeLogin />}
      {user === "user" && <AfterLogin />}
    </div>
  );
};

export default App;

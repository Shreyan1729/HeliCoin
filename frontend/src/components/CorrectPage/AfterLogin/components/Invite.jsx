import React from "react";

const Invite = () => {
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const userId = storedUserData ? storedUserData._id : null;

  const inviteLink = `${window.location.origin}/signup?ref=${userId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied!");
  };

  return (
    <div>
      <h3>Invite Your Friends</h3>
      <input type="text" value={inviteLink} readOnly />
      <button onClick={copyToClipboard}>Copy Link</button>
    </div>
  );
};

export default Invite;

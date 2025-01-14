import noUserPicture from "../../assets/noPlayerIcon.svg";

function ProfilePicture() {
  return (
    <div className="profilePicture">
      <img src={noUserPicture} alt="Profile" />
    </div>
  );
}

export default ProfilePicture;

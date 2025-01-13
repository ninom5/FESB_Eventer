import noUserPicture from "C:/Projekti/FESB_Eventer/frontend/src/assets/noPlayerIcon.svg";

function ProfilePicture() {
  return (
    <div className="profilePicture">
      <img src={noUserPicture} alt="Profile" />
    </div>
  );
}

export default ProfilePicture;

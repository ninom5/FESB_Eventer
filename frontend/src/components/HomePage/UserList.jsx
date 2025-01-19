import noUserPicture from "../../assets/noPlayerIcon.svg";

function UserList({ mostActiveUsers, selectedUser, setSelectedUser }) {
  return (
    <div className="user-list">
      <h3 style={{ color: "white" }}>Most active users</h3>
      <div className="homeUsers">
        {mostActiveUsers?.map((item, index) => {
          return (
            <li key={index} className="homeUserCard">
              <div className="homeUserCardProfile">
                <img src={noUserPicture} />
                <div className="homeUserCardProfileText">
                  <p>
                    {item.ime} {item.prezime}
                  </p>
                  <p style={{ marginTop: "1.5vh", color: "gray" }}>
                    {item.email}
                  </p>
                  <p style={{ color: "gray" }}>
                    {item.tkorisnika === "Korisnik" ? "User" : "Organiser"}
                  </p>
                </div>
              </div>
              <div className="homeUserCardData">
                <div>
                  <p
                    style={{
                      marginTop: "1vh",
                      color: "gray",
                      fontWeight: "500",
                    }}
                  >
                    {item.tkorisnika === "Korisnik"
                      ? "NEXT ATTENDING EVENT"
                      : "UPCOMING EVENT"}
                  </p>
                  <p style={{ marginBottom: "2vh", color: "white" }}>
                    {item.sljedeci}
                  </p>
                  <p style={{ color: "gray", fontWeight: "500" }}>
                    {item.tkorisnika === "Korisnik"
                      ? "No. ATTENDED EVENTS"
                      : "No. ORGANISED EVENTS"}
                  </p>
                  <p style={{ color: "white" }}>{item.brojdogadaja}</p>
                </div>
                <button
                  className="addEventButton"
                  style={{ width: "100%", margin: "0" }}
                >
                  See more
                </button>
              </div>
            </li>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;

import noUserPicture from "../../assets/noPlayerIcon.svg";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

function UserList({ mostActiveUsers }) {
  const navigate = useNavigate();

  return (
    <div className="user-list">
      <h3 style={{ color: "white" }}>Most active users</h3>
      <div className="homeUsers">
        {mostActiveUsers?.map((item, index) => {
          return (
            <li
              key={index}
              className="homeUserCard"
              onClick={() => {
                navigate(`/profile/${item.email}`, {
                  state: { canEdit: false },
                });
              }}
            >
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
                    {item.tkorisnika === "user" ? "Organiser" : "Admin"}
                  </p>
                </div>
              </div>
              <div className="homeUserCardData">
                <div className="homeUserCardDataDiv">
                  <p
                    style={{
                      marginTop: "1vh",
                      color: "gray",
                      fontWeight: "500",
                    }}
                  >
                    {item.tkorisnika === "user"
                      ? "NEXT ATTENDING EVENT"
                      : "UPCOMING EVENT"}
                  </p>
                  <p style={{ marginBottom: "2vh", color: "white" }}>
                    {item.sljedeci}
                  </p>
                  <p style={{ color: "gray", fontWeight: "500" }}>
                    {item.tkorisnika === "user"
                      ? "No. ATTENDED EVENTS"
                      : "No. ORGANISED EVENTS"}
                  </p>
                  <p style={{ color: "white" }}>{item.brojdogadaja}</p>
                </div>
                <div
                  className="home-user-card-button"
                  style={{ width: "100%", margin: "0" }}
                >
                  <div className="home-user-card-icon">
                    <FontAwesomeIcon icon={faLocationArrow} color="black" />
                  </div>
                  <p>See more</p>
                </div>
              </div>
            </li>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;

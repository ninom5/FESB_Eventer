import noUserPicture from "../../assets/noPlayerIcon.svg";

function UserList({ mostActiveUsers, selectedUser, setSelectedUser }) {
  return (
    <div className="user-list">
      <h3 style={{ color: "white" }}>Most active users</h3>
      <div className="homeUsers">
        {mostActiveUsers?.map((item, index) => {
          return (
            <li
              key={index}
              className={`homeUserCard${
                selectedUser === index ? " selected" : ""
              }`}
              onMouseEnter={() => setSelectedUser(index)}
            >
              <div className="homeUserCardProfile">
                <img src={noUserPicture} />
                <div className="homeUserCardProfileText">
                  <p>
                    {item.ime} {item.prezime}
                  </p>
                  <p>{item.email}</p>
                  <p>{item.tkorisnika === "user" ? "Organiser" : "Admin"}</p>
                </div>
              </div>
              <div className="homeUserCardData">
                <div>
                  <p>
                    {item.tkorisnika === "Korisnik"
                      ? "Next attending event: "
                      : "Upcoming event: "}
                    {item.sljedeci}
                  </p>
                  {/* <p>
                    {item.tkorisnika === "Korisnik"
                      ? "No. attended events: "
                      : "No. organised events: "}
                    {item.brojdogadaja}
                  </p> */}
                </div>
                <button>See more</button>
              </div>
            </li>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;

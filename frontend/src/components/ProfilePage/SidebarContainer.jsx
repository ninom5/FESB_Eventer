import { useNavigate } from "react-router-dom";

function SidebarContainer({ canEdit }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar-container">
      <nav>
        <h3 className="sidebar-container__heading">General</h3>
        <hr style={{ width: "90%", borderColor: "gray" }} />
        <ul className="sidebar-list">
          <li>
            <button
              onClick={() =>
                document
                  .getElementById("profile")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                document
                  .getElementById("signIn")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Sign in & security
            </button>
          </li>
          {canEdit ? (
            <li>
              <button onClick={() => navigate("/myevents")}>My events</button>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}
export default SidebarContainer;

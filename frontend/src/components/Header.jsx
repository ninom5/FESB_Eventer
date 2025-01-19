import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import headerLogo from "../assets/headerLogo.jpg";
import {
  faSearch,
  faPartyHorn,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState({
    events: [],
    users: [],
  });
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);
  const resultsRef = useRef(null);

  const handleSearch = async () => {
    try {
      const res = await axios.post("http://localhost:5000/search", {
        searchValue: searchValue,
      });

      setResults({ events: res.data.events, users: res.data.users });
      setShowResults(true);
      if (resultsRef.current) {
        resultsRef.current.scrollTop = 0;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="homePage-header">
      <div className="header-logo">
        <img
          src={headerLogo}
          style={{ cursor: "pointer" }}
          alt="Eventer logo"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="search-bar-container" ref={searchContainerRef}>
        <div>
          <input
            className="search-input"
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            type="text"
            id="input"
            name="input"
            value={searchValue}
            placeholder="Search events and users"
          />
          <div className="search-icon">
            <FontAwesomeIcon icon={faSearch} color="white" />
          </div>
        </div>
        {showResults && (
          <div className="search-results" ref={resultsRef}>
            {results.events.length > 0 && (
              <div className="results-group">
                <h4>Events</h4>
                <ul>
                  {results.events.map((event) => (
                    <li
                      key={event.id}
                      className="result-item"
                      onClick={() => {
                        navigate("/events", { state: event, replace: true });
                        setShowResults(false);
                      }}
                    >
                      {event.korisnik}, {event.naziv} - {event.adresa}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.users.length > 0 && (
              <div className="results-group">
                <h4>Users</h4>
                <ul>
                  {results.users.map((user) => (
                    <li key={user.id} className="result-item">
                      {user.naziv}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.events.length === 0 && results.users.length === 0 && (
              <div className="no-results">No results for "{searchValue}"</div>
            )}
          </div>
        )}
      </div>

      <nav className="homePage-navigation">
        <ul>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/events">Events</a>
          </li>
          <li className="logout-button">
            <a
              href="/login"
              onClick={() => localStorage.removeItem("accessToken")}
            >
              Log out
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

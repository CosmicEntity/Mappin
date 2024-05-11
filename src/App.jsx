import { useEffect, useState, useRef } from "react";
import Axios from "../axios.config.js";
import { format } from "timeago.js";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star, FiberManualRecordRounded } from "@material-ui/icons";
import { Triangle } from "react-loader-spinner";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const mapRef = useRef(null);
  const [viewport, setViewport] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 2.75,
  });
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await Axios.get("/pins");
        setPins(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    mapRef.current?.flyTo({ center: [long, lat], duration: 2000 });
  };

  const handleAddClick = (event) => {
    const long = event.lngLat.lng;
    const lat = event.lngLat.lat;

    currentUser && setNewPlace({ lat, long });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await Axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div>
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX}
        {...viewport}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/cosmicentity/clkh3xeat007h01qy3ukq8v1c"
        onZoom={(event) => setViewport(event.viewState)}
        onDblClick={handleAddClick}
        onMove={(event) => setViewport(event.viewState)}
      >
        {loading ? (
          <Triangle
            height="80"
            width="80"
            color="slateblue"
            ariaLabel="triangle-loading"
            visible={true}
            wrapperStyle={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : (
          pins.map((p) => (
            <div key={p._id}>
              <Marker
                longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
                offset={[0, 0]}
              >
                <Room
                  style={{
                    fontSize: viewport.zoom * 10,
                    color: p.username === currentUser ? "tomato" : "slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                />
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  longitude={p.long}
                  latitude={p.lat}
                  anchor="top"
                  offset={[0, -12]}
                  closeOnClick={false}
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label>Review</label>
                    <p className="desc">{p.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(p.rating).fill(<Star className="star" />)}
                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{p.username}</b>
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </div>
          ))
        )}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Place</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Tell us about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submit-button" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}

        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button
              className="button login"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
        <div className="legends">
          <p className="legend-title">LEGENDS</p>
          <p className="user">
            <FiberManualRecordRounded className="user-marker" /> User Pin(s)
          </p>
          <p className="you">
            <FiberManualRecordRounded className="your-marker" /> Your Pin(s)
          </p>
          <p className="instruction">
            <FiberManualRecordRounded className="misc" /> Click Pin to view
            Info.
          </p>
          <p className="instruction">
            <FiberManualRecordRounded className="misc" /> Double click to add a
            Pin
          </p>
        </div>
      </Map>
    </div>
  );
}

export default App;

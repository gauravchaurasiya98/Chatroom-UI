import { Link } from "react-router";
import { FaComments } from "react-icons/fa";

const Home = () => {
  return (
    <div className="col-12 col-sm-9 p-3 d-flex flex-column align-items-center justify-content-center text-center">
      <h1>Welcome to Chatroom!</h1>
      <p className="lead">
        Connect, collaborate, and communicate effortlessly with our chatroom
        platform. A seamless way to stay engaged and share ideas.
      </p>
      <p className="lead">
        <Link to="/chatroom" className="btn btn-lg btn-primary fw-bold">
          <FaComments style={{ marginRight: "8px", marginBottom: "4px" }} />{" "}
          Join Chatroom
        </Link>
      </p>
    </div>
  );
};

export default Home;

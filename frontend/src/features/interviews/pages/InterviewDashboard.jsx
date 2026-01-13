import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchMyInterviews } from "../api/interviewApi";
import Header from "../../../shared/components/Header";
import { Link } from "react-router-dom";

const InterviewDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = new WebSocket("ws://localhost:8000");

  socket.onopen = () => {
    socket.send("Hello voice service");
  };

  socket.onmessage = (event) => {
    console.log("WS reply:", event.data);
  };

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await fetchMyInterviews(token);
        setInterviews(data);
      } catch (error) {
        console.error("Failed to fetch interviews", error);
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, [token]);

  if (loading) return <p>Loading interviews...</p>;

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-4">My Interviews</h1>

      {interviews.length === 0 ? (
        <p>No interviews yet</p>
      ) : (
        <ul className="space-y-3">
          {interviews.map((interview) => (
            <li
              key={interview._id}
              className="border p-4 rounded-md flex justify-between"
            >
              <span>Status: {interview.status}</span>
              <span>
                {new Date(interview.createdAt).toLocaleString()}
              </span>
              <Link
                to={`/interviews/${interview._id}`}
                className="text-blue-600 underline"
              >
                View Interview
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InterviewDashboard;

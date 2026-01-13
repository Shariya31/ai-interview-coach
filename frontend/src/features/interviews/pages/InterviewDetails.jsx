import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from '../../../shared/utils/api'
import { cleanQuestion } from "../../../shared/utils/cleanQuestion";
const InterviewDetails = () => {
    const { id } = useParams();
    const token = useSelector((state) => state.auth.token);
    const [interview, setInterview] = useState(null);

    useEffect(() => {
        const fetchInterview = async () => {
            const res = await axios.get(
                `${API_BASE_URL}/interviews/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInterview(res.data);
        };

        fetchInterview();
    }, [id, token]);

    if (!interview) return <p>Loading interview...</p>;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Interview Questions</h1>

            {interview.questions?.length ? (
                <ol className="list-decimal ml-6 space-y-3">
                    {interview.questions
                        .map((q) => cleanQuestion(q.question))
                        .filter(Boolean)
                        .map((question, index) => (
                            <li key={index} className="p-3 border rounded">
                                {question}
                            </li>
                        ))}
                </ol>
            ) : (
                <p>No questions generated yet.</p>
            )}
            <Link
                to={`/interviews/${interview._id}/run`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Start Interview
            </Link>
        </div>
    );
};

export default InterviewDetails;

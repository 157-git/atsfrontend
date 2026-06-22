import { Link } from "react-router-dom";


function NavLinks({ setActiveTab }) {
    return (
        <nav style={{ padding: "10px", background: "#f5f5f5" }}>
            <button
                onClick={() => setActiveTab("manage")}
                style={{ marginRight: "20px" }}
            >
                Manage Questions
            </button>

            <button
                onClick={() => setActiveTab("reports")}
                style={{ marginRight: "20px" }}
            >
                View Reports
            </button>

            <button
                onClick={() => setActiveTab("questions")}
                style={{ marginRight: "20px" }}
            >
                Questions
            </button>

            {/* <button onClick={() => setActiveTab("copyLink")}>
                Copy Link
            </button> */}

            {/* <button
                onClick={() => setActiveTab("exam")}
            >
                Exam Page
            </button> */}


        </nav>
    );
}


export default NavLinks;
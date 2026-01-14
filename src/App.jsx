import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateIssue from "./pages/CreateIssue";
import IssueList from "./pages/IssueList";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<CreateIssue />} />
            <Route path="/issues" element={<IssueList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

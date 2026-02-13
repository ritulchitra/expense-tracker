import { Routes, Route, Link } from "react-router-dom";
import PersonalExpenses from "./pages/PersonalExpenses";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/">Personal</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PersonalExpenses />} />
      </Routes>
    </div>
  );
}

export default App;
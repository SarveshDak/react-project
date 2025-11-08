import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState({});

useEffect(() => {
    fetch("https://threatview-backend.onrender.com/api/threats")
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        })
        .then((data) => {
            console.log("✅ Backend Response:", data);
            setData(data);    // <-- important line
        })
        .catch((err) => console.error("❌ Error:", err));
}, []);


 return (
  <div style={{ color: "white", padding: "20px" }}>
    <h1>ThreatView Dashboard ✅</h1>

    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

}

export default App;

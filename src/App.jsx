import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://threatview-backend.onrender.com/api/threats")
      .then((res) => res.json())
      .then((resp) => {
        console.log("✅ Backend Response:", resp);
        setData(resp);
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

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [url, setUrl] = useState("");
  const [jsonData, setJsonData] = useState(""); // Stores the fetched or edited JSON data
  const [viewMode, setViewMode] = useState("html"); // 'html' or 'markdown'
  const [error, setError] = useState(null); // Stores any error during fetching

  // Function to handle the GET request from the provided URL
  function handleFetch() {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data.");
        return response.json();
      })
      .then((data) => {
        setJsonData(JSON.stringify(data, null, 2)); // Format and set JSON data
        setError(null); // Clear any previous errors
      })
      .catch((err) => {
        setError(err.message);
        setJsonData(""); // Clear the data on error
      });
  }

  // Function to handle manual input/editing of JSON in the textarea
  function handleJsonChange(event) {
    setJsonData(event.target.value);
  }

  // Helper function to render JSON dynamically as HTML
  function renderHtml(data) {
    try {
      const parsedData = JSON.parse(data);
      if (typeof parsedData === "string") {
        return <p>{parsedData}</p>;
      }
      if (typeof parsedData === "number" || typeof parsedData === "boolean") {
        return <p>{String(parsedData)}</p>;
      }
      if (Array.isArray(parsedData)) {
        return (
          <ul>
            {parsedData.map((item, index) => (
              <li key={index}>{renderHtml(JSON.stringify(item))}</li>
            ))}
          </ul>
        );
      }
      if (typeof parsedData === "object" && parsedData !== null) {
        return (
          <div>
            {Object.keys(parsedData).map((key) => (
              <div key={key}>
                <strong>{key}:</strong>{" "}
                {renderHtml(JSON.stringify(parsedData[key]))}
              </div>
            ))}
          </div>
        );
      }
      return null;
    } catch (error) {
      return <p>Invalid JSON format.</p>;
    }
  }

  // Helper function to render JSON dynamically as Markdown
  function renderMarkdown(data) {
    try {
      const parsedData = JSON.parse(data);
      if (typeof parsedData === "string") {
        return `${parsedData}\n\n`;
      }
      if (typeof parsedData === "number" || typeof parsedData === "boolean") {
        return `${String(parsedData)}\n\n`;
      }
      if (Array.isArray(parsedData)) {
        return parsedData
          .map((item) => `- ${renderMarkdown(JSON.stringify(item))}`)
          .join("");
      }
      if (typeof parsedData === "object" && parsedData !== null) {
        return Object.keys(parsedData)
          .map(
            (key) =>
              `**${key}**: ${renderMarkdown(JSON.stringify(parsedData[key]))}`
          )
          .join("");
      }
      return "";
    } catch (error) {
      return "Invalid JSON format.\n\n";
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "90vw",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>API Endpoint</h2>
        <div
          style={{
            maxWidth: "60vw",
            width: "100%",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter API URL"
            style={{
              maxWidth: "40vw",
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
            }}
          />
          <button
            onClick={handleFetch}
            style={{ padding: "10px", marginBottom: "10px" }}
          >
            GET
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Left Section: JSON data */}
        <div style={{ width: "100%", maxWidth: "40vw" }}>
          <h2>JSON Data</h2>
          <textarea
            value={jsonData}
            onChange={handleJsonChange}
            rows={20}
            style={{ width: "90%", padding: "10px" }}
          />
        </div>

        {/* Right Section: Render HTML or Markdown */}
        <div style={{ width: "100%", maxWidth: "40vw" }}>
          <h2>Render as</h2>
          <button
            onClick={() => setViewMode("html")}
            style={{ padding: "10px", marginRight: "10px" }}
          >
            HTML
          </button>
          <button
            onClick={() => setViewMode("markdown")}
            style={{ padding: "10px" }}
          >
            Markdown
          </button>

          <div
            style={{
              marginTop: "20px",
              border: "1px solid #ccc",
              padding: "20px",
            }}
          >
            {jsonData &&
              (viewMode === "html" ? (
                renderHtml(jsonData)
              ) : (
                <ReactMarkdown>{renderMarkdown(jsonData)}</ReactMarkdown>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

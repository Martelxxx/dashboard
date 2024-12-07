import React, { useState } from "react";
import "./calendar.css";

const Calendar = () => {
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [manualMode, setManualMode] = useState(false); // To toggle between manual and default mode
  const [results, setResults] = useState({});
  const [score, setScore] = useState(null);
  const [rating, setRating] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingResults, setTypingResults] = useState({}); // For typing effect

  // Full list of positive words with weights
  const positiveWords = [
    { word: "bootstrapped", weight: 5 },
    { word: "self-financed", weight: 5 },
    { word: "independently funded", weight: 4 },
    { word: "self-sustained", weight: 4 },
    { word: "self-funded", weight: 5 },
    { word: "privately financed", weight: 4 },
    { word: "internally supported", weight: 4 },
    { word: "self-backed", weight: 4 },
    { word: "profit-led", weight: 5 },
    { word: "profit-driven", weight: 4 },
    { word: "profit-focused", weight: 4 },
    { word: "revenue-oriented", weight: 4 },
    { word: "customer-funded", weight: 5 },
    { word: "client-financed", weight: 4 },
    { word: "buyer-backed", weight: 4 },
    { word: "user-supported", weight: 3 },
    { word: "revenue-driven", weight: 4 },
    { word: "revenue-focused", weight: 4 },
    { word: "income-oriented", weight: 3 },
    { word: "profit-motivated", weight: 3 },
    { word: "organic growth", weight: 4 },
    { word: "natural expansion", weight: 3 },
    { word: "internally driven growth", weight: 3 },
    { word: "cash-flow positive", weight: 5 },
    { word: "profitable", weight: 5 },
    { word: "in the black", weight: 4 },
    { word: "generating surplus", weight: 4 },
    { word: "sustainable growth", weight: 4 },
    { word: "enduring development", weight: 3 },
    { word: "stable expansion", weight: 3 },
    { word: "long-lasting increase", weight: 3 },
    { word: "no vc funding", weight: 5 },
    { word: "no venture capital backing", weight: 5 },
    { word: "no institutional investment", weight: 4 },
    { word: "no external equity", weight: 4 },
    { word: "no external investors", weight: 4 },
    { word: "not venture-backed", weight: 5 },
    { word: "serving smbs", weight: 5 },
    { word: "selling to small businesses", weight: 5 },
    { word: "b2b saas", weight: 5 },
    { word: "service-based", weight: 5 },
    { word: "targeting early-stage startups", weight: 4 },
    { word: "main street businesses", weight: 4 },
    { word: "brick-and-mortar clients", weight: 4 },
    { word: "long-term focused", weight: 4 },
    { word: "margin improvement", weight: 4 },
    { word: "u.s.-based", weight: 5 },
    { word: "founder-owned", weight: 5 },
    { word: "founder-led", weight: 5 },
    { word: "independent growth", weight: 5 },
    { word: "committed to profitability", weight: 5 },
  ];

  // Full list of negative words with weights
  const negativeWords = [
    { word: "b2c", weight: 3 },
    { word: "direct-to-consumer", weight: 3 },
    { word: "consumer-facing", weight: 3 },
    { word: "retail-focused", weight: 3 },
    { word: "venture-backed", weight: 5 },
    { word: "vc-funded", weight: 5 },
    { word: "investor-sponsored", weight: 4 },
    { word: "venture-financed", weight: 4 },
    { word: "internationally headquartered", weight: 3 },
    { word: "overseas-based", weight: 3 },
    { word: "non-u.s. located", weight: 3 },
    { word: "enterprise-level", weight: 3 },
    { word: "series a", weight: 4 },
    { word: "later-stage investment", weight: 4 },
    { word: "institutional capital round", weight: 4 },
    { word: "unicorn", weight: 5 },
    { word: "ipo", weight: 5 },
    { word: "publicly traded", weight: 4 },
    { word: "50+ employees", weight: 3 },
    { word: "heavily funded", weight: 4 },
    { word: "accelerator-backed", weight: 3 },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "url") {
      setUrl(value);
    } else if (name === "keywords") {
      setKeywords(value);
    }
  };

  const analyzeText = (text) => {
    const positiveMatches = {};
    const negativeMatches = {};

    let positiveWeightedScore = 0;
    let negativeWeightedScore = 0;

    const positiveCount = positiveWords.reduce((acc, { word, weight }) => {
      const matches = (text.match(new RegExp(`\\b${word}\\b`, "gi")) || []).length;
      if (matches > 0) {
        positiveMatches[word] = { count: matches, weight };
        positiveWeightedScore += matches * weight;
      }
      return acc + matches;
    }, 0);

    const negativeCount = negativeWords.reduce((acc, { word, weight }) => {
      const matches = (text.match(new RegExp(`\\b${word}\\b`, "gi")) || []).length;
      if (matches > 0) {
        negativeMatches[word] = { count: matches, weight };
        negativeWeightedScore += matches * weight;
      }
      return acc + matches;
    }, 0);

    setResults({
      positiveMatches,
      negativeMatches,
      positiveCount,
      negativeCount,
      positiveWeightedScore,
      negativeWeightedScore,
    });

    // Calculate score and rating
    if (positiveCount === 0 && negativeCount === 0) {
      setRating("Manual Review Needed");
      setScore(null);
    } else {
      const scaledScore = Math.min(
        100,
        Math.round((positiveWeightedScore / (positiveWeightedScore + negativeWeightedScore)) * 100)
      );
      setScore(scaledScore);

      if (scaledScore >= 75) {
        setRating("Hot");
      } else if (scaledScore >= 50) {
        setRating("Warm");
      } else {
        setRating("Cold");
      }
    }

    // Typing effect
    simulateTypingEffect({
      positiveMatches,
      negativeMatches,
      positiveCount,
      negativeCount,
      positiveWeightedScore,
      negativeWeightedScore,
    });
  };

  const simulateTypingEffect = (data) => {
    const keys = Object.keys(data);
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < keys.length) {
        const key = keys[index];
        setTypingResults((prev) => ({
          ...prev,
          [key]: data[key],
        }));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 300);
  };

  const checkKeywords = async () => {
    setError("");
    setResults({});
    setTypingResults({});
    setScore(null);
    setRating("");
    setLoading(true);

    try {
      console.log("Attempting to fetch URL:", url);

      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch the URL. Status: ${response.status}`);
      }

      const { contents: html } = await response.json();
      const plainText = html.replace(/<[^>]*>/g, "").toLowerCase();
      console.log("Fetched and cleaned text content:", plainText);

      if (manualMode && keywords) {
        const manualKeywords = keywords.split(",").map((kw) => kw.trim().toLowerCase());
        const manualMatches = manualKeywords.reduce((acc, keyword) => {
          const count = (plainText.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length;
          acc[keyword] = count;
          return acc;
        }, {});
        setResults({ manualMatches });
      } else {
        analyzeText(plainText);
      }
    } catch (err) {
      console.error("Error during keyword checking:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calendar-container">
      <h1>Keyword Checker</h1>
      <div className="form-group">
        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          value={url}
          onChange={handleInputChange}
          placeholder="Enter URL"
        />
      </div>
      <div className="form-group">
        <label htmlFor="keywords">Keywords (optional, comma-separated):</label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={keywords}
          onChange={handleInputChange}
          placeholder="Enter keywords for manual mode"
          disabled={!manualMode}
        />
      </div>
      <div className="form-group">
        <input
          type="checkbox"
          id="manualMode"
          checked={manualMode}
          onChange={(e) => setManualMode(e.target.checked)}
        />
        <label htmlFor="manualMode">Enable Manual Keyword Mode</label>
      </div>
      <button onClick={checkKeywords} disabled={loading}>
        {loading ? "Checking..." : "Check Keywords"}
      </button>
  
      {error && <p className="error">{error}</p>}
  
      {typingResults && (
        <div className="results">
          <h2>Results</h2>
          {manualMode ? (
            <>
              <h3>Manual Matches:</h3>
              {Object.keys(results.manualMatches || {}).length === 0 ? (
                <p>No manual keywords found</p>
              ) : (
                <ul>
                  {Object.entries(results.manualMatches).map(([keyword, count]) => (
                    <li key={keyword}>
                      {keyword}: {count}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <p><strong>Positive Matches:</strong> {typingResults.positiveCount || 0}</p>
              <p><strong>Negative Matches:</strong> {typingResults.negativeCount || 0}</p>
              <p><strong>Positive Weighted Score:</strong> {typingResults.positiveWeightedScore || 0}</p>
              <p><strong>Negative Weighted Score:</strong> {typingResults.negativeWeightedScore || 0}</p>
              <p><strong>Score:</strong> {score !== null ? `${score}/100` : "N/A"}</p>
              <p><strong>Rating:</strong> {rating}</p>
              {/* Display positive and negative keywords if they exist */}
              {(results.positiveCount > 0 || results.negativeCount > 0) && (
                <div className="keyword-summary">
                  {results.positiveCount > 0 && (
                    <>
                      <p><strong>Positive Keywords Found:</strong></p>
                      <p className="small-text">
                        {Object.keys(results.positiveMatches || {}).join(", ")}
                      </p>
                    </>
                  )}
                  {results.negativeCount > 0 && (
                    <>
                      <p><strong>Negative Keywords Found:</strong></p>
                      <p className="small-text">
                        {Object.keys(results.negativeMatches || {}).join(", ")}
                      </p>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;
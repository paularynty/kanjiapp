import React, { useEffect, useState } from "react";
import { useTheme } from "../utils/darkMode";

const KanjiList = () => {
  const [kanjiResults, setKanjiResults] = useState([]);
  const [sortType, setSortType] = useState("default"); // Start with "default" sort
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  // Fetch non-sorted Kanji data initially
  useEffect(() => {
    const fetchNonSortedKanji = async () => {
      try {
        const response = await fetch("http://localhost:5001/kanji");
        const resultData = await response.json();
        setKanjiResults(resultData);
      } catch (error) {
        setError("Failed to fetch Kanji data.");
      } finally {
        setLoading(false);
      }
    };

    fetchNonSortedKanji();
  }, []);

  // Fetch sorted Kanji data when the sortType changes
  useEffect(() => {
    const fetchSortedKanji = async () => {
      if (sortType === "default") return; // Don't fetch anything if it's still the default

      try {
        const response = await fetch(
          `http://localhost:5001/kanji/sorted?sortType=${sortType}`
        );
        const resultData = await response.json();
        setKanjiResults(resultData);
      } catch (error) {
        setError("Failed to fetch sorted Kanji data.");
      }
    };

    fetchSortedKanji(); // Trigger sorting request when sortType changes
  }, [sortType]); // Depend on sortType so it re-runs when sorting changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!Array.isArray(kanjiResults) || kanjiResults.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <div className="button-sort">
        <select
          defaultValue="default"
          onChange={(e) => setSortType(e.target.value)}
        >
          <option disabled value="default">
            Sort by
          </option>
          <option value="ascending">Ascending (Stroke count)</option>
          <option value="descending">Descending (Stroke count)</option>
        </select>
      </div>
      <div className="grid-container">
        {kanjiResults.map((kanji, index) =>
          kanji.kanji.character ? (
            <div
              className={
                darkMode
                  ? "grid-item-clickable dark-mode"
                  : "grid-item-clickable"
              }
              key={index}
              onClick={() =>
                (window.location.href = `/kanji/${kanji.kanji.character}`)
              }
            >
              {kanji.kanji.character}
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  lineHeight: "0.8rem",
                  marginTop: "0.5rem",
                }}
              >
                {kanji.kanji.meaning &&
                typeof kanji.kanji.meaning === "object" &&
                kanji.kanji.meaning.english
                  ? kanji.kanji.meaning.english
                  : "N/A"}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default KanjiList;

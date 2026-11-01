
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [mysteryCase, setMysteryCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [revealedClues, setRevealedClues] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState(null);
  const [submitting, setSubmitting] = useState(false); 

  useEffect(() => {
    async function fetchCase() {
      try {
        const response = await axios.get(`${API_URL}/cases`);
        setMysteryCase(response.data);
      } catch (err) {
        setError("Unable to load the mystery case. Please check your backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchCase();
  }, []);

  function revealClue(clueId) {
    setRevealedClues((previous) =>
      previous.includes(clueId)
        ? previous
        : [...previous, clueId]
    );
  }
  async function submitAnswer() {
  if (!selectedAnswer) {
    alert("Please select a suspect first!");
    return;
  }

  try {
    setSubmitting(true);

    const response = await axios.post(
      `${API_URL}/submit-answer`,
      {
        suspectId: Number(selectedAnswer)
      }
    );

    setAnswerResult(response.data);
  } catch (error) {
    alert("Unable to submit answer. Please check your backend.");
  } finally {
    setSubmitting(false);
  }
}
async function handleNewMystery() {
  try {
    setLoading(true);
    setError("");
    setAnswerResult(null);
    setSelectedAnswer("");
    setSelectedSuspect(null);
    setRevealedClues([]);

    const response = await axios.post(
      `${API_URL}/new-case`
    );

    setMysteryCase(response.data.mysteryCase);
  } catch (error) {
    setError("Unable to load a new mystery case. Please check your backend.");
  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return <div className="loading">Loading Mystery Room...</div>;
  }

  if (error) {
    return <div className="loading error">{error}</div>;
  }

  if (!mysteryCase) {
    return <div className="loading">No mystery case found.</div>;
  }

  return (
    <div className="app-container">

      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">🔎</span>
          <h2>AI Mystery Room</h2>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          INVESTIGATION ACTIVE
        </div>
      </header>

      <main className="dashboard">

        <section className="case-header">
          <div>
            <p className="eyebrow">YOUR CURRENT INVESTIGATION</p>
            <h1>{mysteryCase.title}</h1>
            <button
              className="submit-button"
              onClick={handleNewMystery}
              disabled={loading}
            >
              {loading ? "Loading New Case..." : "🕵️ New Mystery"}
            </button>
            <p className="case-description">
              {mysteryCase.description}
            </p>
          </div>

          <div className="case-info">
            <div>
              <span>DIFFICULTY</span>
              <strong>{mysteryCase.difficulty}</strong>
            </div>

            <div>
              <span>LOCATION</span>
              <strong>{mysteryCase.location}</strong>
            </div>
          </div>
        </section>

        <section className="progress-section">
          <div>
            <span>INVESTIGATION PROGRESS</span>
            <strong>
              {revealedClues.length} / {mysteryCase.clues.length} clues discovered
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${(revealedClues.length / mysteryCase.clues.length) * 100}%`,
              }}
            ></div>
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PEOPLE OF INTEREST</p>
              <h2>Suspects</h2>
            </div>
            <span className="count">{mysteryCase.suspects.length} SUSPECTS</span>
          </div>

          <div className="suspect-grid">
            {mysteryCase.suspects.map((suspect) => (
              <article className="suspect-card" key={suspect.id}>
                <div className="suspect-avatar">👤</div>

                <h3>{suspect.name}</h3>
                <p className="suspect-role">{suspect.role}</p>

                <button
                  className="secondary-button"
                  onClick={() => setSelectedSuspect(suspect)}
                >
                  View Statement
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">COLLECTED EVIDENCE</p>
              <h2>Investigation Clues</h2>
            </div>
            <span className="count">
              {mysteryCase.clues.length} CLUES
            </span>
          </div>

          <div className="clue-grid">
            {mysteryCase.clues.map((clue) => {
              const revealed = revealedClues.includes(clue.id);

              return (
                <article className="clue-card" key={clue.id}>
                  <div className="clue-top">
                    <span className="clue-icon">🔍</span>
                    <span className={revealed ? "found" : "hidden"}>
                      {revealed ? "DISCOVERED" : "UNDISCOVERED"}
                    </span>
                  </div>

                  <h3>{clue.title}</h3>

                  <p>
                    {revealed
                      ? clue.description
                      : "This evidence is waiting to be examined."}
                  </p>

                  <button
                    className="clue-button"
                    onClick={() => revealClue(clue.id)}
                    disabled={revealed}
                  >
                    {revealed ? "Clue Discovered ✓" : "Examine Clue"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FINAL INVESTIGATION</p>
              <h2>Who Is The Culprit?</h2>
            </div>
          </div>

          <div className="answer-card">
            <p>Select the person you believe is responsible.</p>

            <div className="answer-options">
              {mysteryCase.suspects.map((suspect) => (
                <button
                  key={suspect.id}
                  className={
                    selectedAnswer === String(suspect.id)
                      ? "answer-option selected"
                      : "answer-option"
                  }
                  onClick={() => {
                    setSelectedAnswer(String(suspect.id));
                    setAnswerResult(null);
                  }}
                  disabled={!!answerResult}
                >
                  {suspect.name}
                </button>
              ))}
            </div>

            <button
              className="submit-button"
              onClick={submitAnswer}
              disabled={submitting || !!answerResult}
            >
              {submitting ? "Submitting..." : "Submit Final Answer"}
            </button>

            {answerResult && (
              <div className={
                answerResult.correct ? "result correct" : "result incorrect"
              }>
                <h3>
                  {answerResult.correct ? "🎉 Case Solved!" : "❌ Wrong Answer"}
                </h3>

                <p>{answerResult.message}</p>
                <p>{answerResult.explanation}</p>
              </div>
            )}
          </div>
        </section>

        {selectedSuspect && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedSuspect(null)}
          >
            <div
              className="modal"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="close-button"
                onClick={() => setSelectedSuspect(null)}
              >
                ×
              </button>

              <p className="eyebrow">SUSPECT INTERVIEW</p>
              <h2>{selectedSuspect.name}</h2>
              <p className="suspect-role">{selectedSuspect.role}</p>

              <div className="statement">
                "{selectedSuspect.statement}"
              </div>
            </div>
          </div>
        )}

        <footer>
          AI MYSTERY ROOM · THINK DEEPER. FIND THE TRUTH.
        </footer>

      </main>
    </div>
  );
}

export default App;

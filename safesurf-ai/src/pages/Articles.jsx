import { useState } from "react";
import { articles } from "../data/articles";
import "../styles/Articles.css";

function Articles() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles = articles.filter((article) => {
    const query = search.toLowerCase();

    const matchesSearch =
      article.title.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      article.overview.toLowerCase().includes(query) ||
      article.symptoms.toLowerCase().includes(query) ||
      article.causes.toLowerCase().includes(query) ||
      article.warningSigns.toLowerCase().includes(query) ||
      article.management.toLowerCase().includes(query) ||
      article.outlook.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleReadMore = (article) => {
    setSelectedArticle(article);

    // Move page to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeArticle = () => {
    setSelectedArticle(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="articles-page">

      {/* ================= HEADER ================= */}
      <div className="articles-header">
        <h1>Health Articles</h1>

        <p>
          Explore easy-to-understand information about different
          health conditions.
        </p>

        <input
          type="text"
          placeholder="Search disease or condition..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedArticle(null);
          }}
        />

        {/* ================= FILTERS ================= */}
        <div className="article-filters">

          <button
            className={
              selectedCategory === "All" ? "active" : ""
            }
            onClick={() => {
              setSelectedCategory("All");
              setSelectedArticle(null);
            }}
          >
            All
          </button>

          <button
            className={
              selectedCategory === "Chronic Condition"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedCategory("Chronic Condition");
              setSelectedArticle(null);
            }}
          >
            Chronic
          </button>

          <button
            className={
              selectedCategory === "Infectious Disease"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedCategory("Infectious Disease");
              setSelectedArticle(null);
            }}
          >
            Infectious
          </button>

          <button
            className={
              selectedCategory === "Mental Health"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedCategory("Mental Health");
              setSelectedArticle(null);
            }}
          >
            Mental Health
          </button>

          <button
            className={
              selectedCategory === "Common Condition"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedCategory("Common Condition");
              setSelectedArticle(null);
            }}
          >
            Common
          </button>

          <button
            className={
              selectedCategory === "Serious Condition"
                ? "active"
                : ""
            }
            onClick={() => {
              setSelectedCategory("Serious Condition");
              setSelectedArticle(null);
            }}
          >
            Serious
          </button>

        </div>
      </div>


      {/* =================================================
          SELECTED ARTICLE
      ================================================= */}

      {selectedArticle && (
        <div className="selected-article">

          <button
            className="close-article"
            onClick={closeArticle}
          >
            ← Back to Articles
          </button>

          <span className="article-category">
            {selectedArticle.category}
          </span>

          <h2>{selectedArticle.title}</h2>

          <h4>What is it?</h4>
          <p>{selectedArticle.overview}</p>

          <h4>Common Symptoms</h4>
          <p>{selectedArticle.symptoms}</p>

          <h4>Causes / Risk Factors</h4>
          <p>{selectedArticle.causes}</p>

          <h4>Important Warning Signs</h4>
          <p>{selectedArticle.warningSigns}</p>

          <h4>Management</h4>
          <p>{selectedArticle.management}</p>

          <h4>Outlook</h4>
          <p>{selectedArticle.outlook}</p>

          <a
            href={selectedArticle.source}
            target="_blank"
            rel="noopener noreferrer"
            className="article-button"
          >
            Read Full Article →
          </a>

        </div>
      )}


      {/* =================================================
          ARTICLE CARDS
      ================================================= */}

      {!selectedArticle && (
        <div className="articles-grid">

          {filteredArticles.length > 0 ? (

            filteredArticles.map((article) => (
              <article
                className="article-card"
                key={article.id}
              >

                <span className="article-category">
                  {article.category}
                </span>

                <h2>{article.title}</h2>

                <h4>What is it?</h4>
                <p>{article.overview}</p>

                <button
                  className="article-button"
                  onClick={() => handleReadMore(article)}
                >
                  Read More →
                </button>

              </article>
            ))

          ) : (

            <p className="no-results">
              No matching health condition found.
            </p>

          )}

        </div>
      )}

    </section>
  );
}

export default Articles;
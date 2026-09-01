import { useState } from "react";
import { articles } from "../data/articles";
import "../styles/Articles.css";

// =====================================================
// CATEGORY → TAB COLOR SLUG
//
// Maps each category label to a short slug used purely as a
// styling hook (data-category="..."). Articles.css uses this to
// give every category its own "chart tab" color, the same way a
// paper medical record gets color-coded folder tabs so it can be
// spotted in a filing shelf at a glance.
// =====================================================

const CATEGORY_SLUGS = {
  "Chronic Condition": "chronic",
  "Infectious Disease": "infectious",
  "Common Condition": "common",
  "Serious Condition": "serious",
  "Mental Health": "mental-health",
  "Hormonal Conditions": "hormonal",
  "Menstrual Conditions": "menstrual",
  "Reproductive Conditions": "reproductive",
  "Gynecological Conditions": "gynecological",
  "Menopause & Midlife Health": "menopause",
  "Rare & Ultra-Rare": "rare",
};

const categorySlug = (category) => CATEGORY_SLUGS[category] || "general";

function Articles() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);

  // =====================================================
  // SEARCH + CATEGORY FILTER
  // =====================================================
const filteredArticles = articles
  .filter((article) => {
    const query = search.toLowerCase().trim();

    // Search only the fields that actually describe WHAT the
    // condition is (title, category, overview). Matching against
    // symptoms/causes/warningSigns/management/outlook too was
    // pulling in unrelated conditions just because they mention a
    // term in passing — e.g. searching "bleeding" surfaced Dengue
    // and Stroke because their warning-signs text says "bleeding
    // or unusual weakness can require urgent attention," even
    // though neither condition is actually about bleeding.
    const searchableText = `
      ${article.title}
      ${article.category}
      ${article.overview}
    `.toLowerCase();

    const matchesSearch =
      query === "" || searchableText.includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    const query = search.toLowerCase().trim();

    if (!query) return 0;

    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();

    const aCategory = a.category.toLowerCase();
    const bCategory = b.category.toLowerCase();

    // 1. Exact title match
    if (aTitle === query && bTitle !== query) return -1;
    if (bTitle === query && aTitle !== query) return 1;

    // 2. Title starts with search
    if (
      aTitle.startsWith(query) &&
      !bTitle.startsWith(query)
    ) {
      return -1;
    }

    if (
      bTitle.startsWith(query) &&
      !aTitle.startsWith(query)
    ) {
      return 1;
    }

    // 3. Search word appears in title
    const aTitleIndex = aTitle.indexOf(query);
    const bTitleIndex = bTitle.indexOf(query);

    if (aTitleIndex !== -1 && bTitleIndex === -1) {
      return -1;
    }

    if (bTitleIndex !== -1 && aTitleIndex === -1) {
      return 1;
    }

    // 4. Category match
    const aCategoryMatch = aCategory.includes(query);
    const bCategoryMatch = bCategory.includes(query);

    if (aCategoryMatch && !bCategoryMatch) {
      return -1;
    }

    if (bCategoryMatch && !aCategoryMatch) {
      return 1;
    }

    return 0;
  });

  // =====================================================
  // READ MORE
  // =====================================================

  const handleReadMore = (article) => {
    setSelectedArticle(article);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // BACK TO ARTICLES
  // =====================================================

  const closeArticle = () => {
    setSelectedArticle(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CATEGORY BUTTON
  // =====================================================

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedArticle(null);
  };

  return (
    <section className="articles-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="articles-header">

        <span className="articles-badge">
          ✦ EDUCATIONAL HEALTH LIBRARY
        </span>

        <h1>Health Articles</h1>

        <p>
          Explore easy-to-understand information about different
          health conditions, including common, serious, women's
          health and rare diseases.
        </p>

        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <div className="articles-search">

          <span className="articles-search-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search disease or condition..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedArticle(null);
            }}
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                setSelectedArticle(null);
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>
          )}

        </div>

        {/* =================================================
            CATEGORY FILTERS
        ================================================= */}

        <div className="article-filters">

          {/* ALL */}

          <button
            className={selectedCategory === "All" ? "active" : ""}
            onClick={() => handleCategoryChange("All")}
          >
            All
          </button>

          {/* CHRONIC */}

          <button
            className={
              selectedCategory === "Chronic Condition"
                ? "active"
                : ""
            }
            data-category="chronic"
            onClick={() =>
              handleCategoryChange("Chronic Condition")
            }
          >
            Chronic
          </button>

          {/* INFECTIOUS */}

          <button
            className={
              selectedCategory === "Infectious Disease"
                ? "active"
                : ""
            }
            data-category="infectious"
            onClick={() =>
              handleCategoryChange("Infectious Disease")
            }
          >
            Infectious
          </button>

          {/* COMMON */}

          <button
            className={
              selectedCategory === "Common Condition"
                ? "active"
                : ""
            }
            data-category="common"
            onClick={() =>
              handleCategoryChange("Common Condition")
            }
          >
            Common
          </button>

          {/* SERIOUS */}

          <button
            className={
              selectedCategory === "Serious Condition"
                ? "active"
                : ""
            }
            data-category="serious"
            onClick={() =>
              handleCategoryChange("Serious Condition")
            }
          >
            Serious
          </button>

          {/* MENTAL HEALTH */}

          <button
            className={
              selectedCategory === "Mental Health"
                ? "active"
                : ""
            }
            data-category="mental-health"
            onClick={() =>
              handleCategoryChange("Mental Health")
            }
          >
            Mental Health
          </button>

          {/* =================================================
              WOMEN'S HEALTH
          ================================================= */}

          {/* HORMONAL */}

          <button
            className={
              selectedCategory === "Hormonal Conditions"
                ? "active"
                : ""
            }
            data-category="hormonal"
            onClick={() =>
              handleCategoryChange("Hormonal Conditions")
            }
          >
            Hormonal
          </button>

          {/* MENSTRUAL */}

          <button
            className={
              selectedCategory === "Menstrual Conditions"
                ? "active"
                : ""
            }
            data-category="menstrual"
            onClick={() =>
              handleCategoryChange("Menstrual Conditions")
            }
          >
            Menstrual
          </button>

          {/* REPRODUCTIVE */}

          <button
            className={
              selectedCategory === "Reproductive Conditions"
                ? "active"
                : ""
            }
            data-category="reproductive"
            onClick={() =>
              handleCategoryChange("Reproductive Conditions")
            }
          >
            Reproductive
          </button>

          {/* GYNECOLOGICAL */}

          <button
            className={
              selectedCategory === "Gynecological Conditions"
                ? "active"
                : ""
            }
            data-category="gynecological"
            onClick={() =>
              handleCategoryChange("Gynecological Conditions")
            }
          >
            Gynecological
          </button>

          {/* MENOPAUSE */}

          <button
            className={
              selectedCategory ===
              "Menopause & Midlife Health"
                ? "active"
                : ""
            }
            data-category="menopause"
            onClick={() =>
              handleCategoryChange(
                "Menopause & Midlife Health"
              )
            }
          >
            Menopause & Midlife
          </button>

          {/* RARE */}

          <button
            className={
              selectedCategory === "Rare & Ultra-Rare"
                ? "active"
                : ""
            }
            data-category="rare"
            onClick={() =>
              handleCategoryChange("Rare & Ultra-Rare")
            }
          >
            Rare & Ultra-Rare
          </button>

        </div>
      </div>

      {/* =================================================
          SELECTED ARTICLE / FULL ARTICLE
      ================================================= */}

      {selectedArticle && (

        <div
          className="selected-article"
          data-category={categorySlug(selectedArticle.category)}
        >

          {/* BACK BUTTON */}

          <button
            className="close-article"
            onClick={closeArticle}
          >
            ← Back to Articles
          </button>

          {/* CATEGORY */}

          <span className="article-category">
            {selectedArticle.category}
          </span>

          {/* TITLE */}

          <h2>
            {selectedArticle.title}
          </h2>

          {/* WHAT IS IT */}

          <h4>
            What is it?
          </h4>

          <p>
            {selectedArticle.overview}
          </p>

          {/* SYMPTOMS */}

          <h4>
            Common Symptoms
          </h4>

          <p>
            {selectedArticle.symptoms}
          </p>

          {/* CAUSES */}

          <h4>
            Causes / Risk Factors
          </h4>

          <p>
            {selectedArticle.causes}
          </p>

          {/* WARNING SIGNS */}

          <h4>
            Important Warning Signs
          </h4>

          <p>
            {selectedArticle.warningSigns}
          </p>

          {/* MANAGEMENT */}

          <h4>
            Management
          </h4>

          <p>
            {selectedArticle.management}
          </p>

          {/* OUTLOOK */}

          <h4>
            Outlook
          </h4>

          <p>
            {selectedArticle.outlook}
          </p>

          {/* TRUSTED SOURCE */}

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

        <div className="articles-grid-wrapper">

          {(search.trim() !== "" || selectedCategory !== "All") && (

            <p className="articles-results-count">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "condition" : "conditions"} found
            </p>

          )}

          <div className="articles-grid">

          {filteredArticles.length > 0 ? (

            filteredArticles.map((article) => (

              <article
                className="article-card"
                key={article.id}
                data-category={categorySlug(article.category)}
              >

                {/* CATEGORY */}

                <span className="article-category">
                  {article.category}
                </span>

                {/* TITLE */}

                <h2>
                  {article.title}
                </h2>

                {/* OVERVIEW */}

                <h4>
                  What is it?
                </h4>

                <p>
                  {article.overview}
                </p>

                {/* READ MORE */}

                <button
                  className="article-button"
                  onClick={() =>
                    handleReadMore(article)
                  }
                >
                  Read More →
                </button>

              </article>

            ))

          ) : (

            <div className="no-results">

              <span className="no-results-icon">
                🔍
              </span>

              <h3>
                No matching health condition found.
              </h3>

              <p>
                Try searching for another disease,
                condition or category.
              </p>

            </div>

          )}

          </div>

        </div>
      )}

      {/* =================================================
          MEDICAL INFORMATION NOTICE
      ================================================= */}

      <div className="medical-information-notice">

        <h3>
          ⚕️ Medical Information Notice
        </h3>

        <p>
          This information is provided for educational purposes
          and does not replace professional medical advice,
          diagnosis, or treatment. Seek advice from a qualified
          healthcare professional for personal medical concerns.
        </p>

      </div>

    </section>
  );
}

export default Articles;
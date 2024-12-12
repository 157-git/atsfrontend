



export const highlightText = (text, term) => {
    if (!term) return text;

    const textString = text?.toString() || ""; // Ensure text is a string or default to an empty string
    const parts = textString.split(new RegExp(`(${term})`, "gi")); // Split by the term, preserving matches

    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };
import React, { useState, useRef, useEffect } from "react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  maxSuggestions?: number;
  suggestionStyle?: React.CSSProperties;
  suggestionItemStyle?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  style,
  inputStyle,
  suggestions = [],
  onSelectSuggestion,
  maxSuggestions = 10,
  suggestionStyle,
  suggestionItemStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  const filteredSuggestions = suggestions
    .filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase().trim())
    )
    .slice(0, maxSuggestions);

  // Show suggestions when there's input and filtered results
  // Use setTimeout to defer state updates
  useEffect(() => {
    const shouldOpen =
      value.trim().length > 0 && filteredSuggestions.length > 0;
    const timeoutId = setTimeout(() => {
      setIsOpen(shouldOpen);
      setSelectedIndex(-1);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [value, filteredSuggestions.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = () => {
    if (value.trim().length > 0 && filteredSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click on suggestion to register
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else if (filteredSuggestions.length > 0) {
          handleSuggestionClick(filteredSuggestions[0]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current && isOpen) {
      const selectedElement = suggestionsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex, isOpen]);

  const defaultStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1000,
    ...style,
  };

  const defaultInputStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "200px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    ...inputStyle,
  };

  const defaultSuggestionStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "4px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    maxHeight: "300px",
    overflowY: "auto",
    width: "200px",
    zIndex: 1001,
    ...suggestionStyle,
  };

  const defaultSuggestionItemStyle: React.CSSProperties = {
    padding: "10px 12px",
    cursor: "pointer",
    fontSize: "14px",
    borderBottom: "1px solid #f0f0f0",
    transition: "background-color 0.2s",
    ...suggestionItemStyle,
  };

  return (
    <div style={defaultStyle}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        style={defaultInputStyle}
      />
      {isOpen && filteredSuggestions.length > 0 && (
        <div ref={suggestionsRef} style={defaultSuggestionStyle}>
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                ...defaultSuggestionItemStyle,
                backgroundColor: selectedIndex === index ? "#f0f0f0" : "white",
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

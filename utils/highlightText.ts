export function highlightText(message: string, query: string): string {
    if (!query) return message; // If no query, return the original message.
  
    // Split the query into multiple terms
    const searchTerms = query.split(' ').map(term => term.trim()).filter(Boolean);
    
    // Iterate over each search term and create a dynamic regex for each
    searchTerms.forEach(term => {
      // Escape special characters in the search term
      const regex = new RegExp(`(${term})`, 'gi'); // 'g' for global, 'i' for case-insensitive
      
      // Replace matching text with a <span> element with a light green color
      message = message.replace(regex, (match) => {
        return `<span style="background-color: lightgreen;">${match}</span>`;
      });
    });
  
    return message;
  }
  
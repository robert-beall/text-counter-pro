// Add this method to your App class
const fuzzySearch = (query, wordFrequencies, limit = 50) => {
    if (!wordFrequencies || wordFrequencies.length === 0) {
        return [];
    }

    if (!query || query.trim() === '') {
        return wordFrequencies.slice(0, limit);
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    // Convert wildcards to regex pattern
    const createPattern = (term) => {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const withWildcards = escaped.replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
        return new RegExp(withWildcards, 'i');
    };
    
    const pattern = createPattern(searchTerm);
    
    for (const [word, frequency] of wordFrequencies) {
        let score = 0;
        const lowerWord = word.toLowerCase();
        
        // Exact match (highest priority)
        if (lowerWord === searchTerm) {
            score = 1000 + frequency;
        }
        // Starts with query (high priority)
        else if (lowerWord.startsWith(searchTerm)) {
            score = 800 + frequency;
        }
        // Contains query (medium priority)
        else if (lowerWord.includes(searchTerm)) {
            score = 600 + frequency;
        }
        // Wildcard/regex match (lower priority)
        else if (pattern.test(word)) {
            score = 400 + frequency;
        }
        // Fuzzy match using simple character similarity
        else {
            const similarity = calculateSimilarity(lowerWord, searchTerm);
            if (similarity > 0.6) {
                score = Math.floor(similarity * 200) + frequency;
            }
        }
        
        if (score > 0) {
            results.push([word, frequency, score]);
        }
    }
    
    // Sort by score (descending) and return original format
    return results
        .sort((a, b) => b[2] - a[2])
        .slice(0, limit)
        .map(([word, freq]) => [word, freq]);
};

// Helper method for fuzzy matching
const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Lightweight Levenshtein distance calculation
const levenshteinDistance = (str1, str2) => {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
        Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,     // insertion
                matrix[j - 1][i] + 1,     // deletion
                matrix[j - 1][i - 1] + cost // substitution
            );
        }
    }
    
    return matrix[str2.length][str1.length];
}

export default fuzzySearch;
// GooseFilms Founding Members Configuration
const MEMBERS_CONFIG = {
    // Founding members data
    members: [
        {
            id: 1,
            name: "Camelia",
            role: "Film Expert",
            location: "Iași, Romania",
            profileImg: "🎭",
            speciality: "European Cinema",
            favoriteGenre: "Art House",
            moviesWatched: 2847,
            memberSince: "Founding Member",
            quote: "Cinema is the mirror of culture and soul.",
            bio: "A film expert from Iași, Romania with an encyclopedic knowledge of European and world cinema. Camelia brings sophisticated taste and deep analytical insights to our movie selections."
        },
        {
            id: 2,
            name: "Prada",
            role: "Tech Mastermind",
            location: "India",
            profileImg: "💻",
            speciality: "Sci-Fi & Tech Thrillers",
            favoriteGenre: "Science Fiction",
            moviesWatched: 1523,
            memberSince: "Founding Member",
            quote: "The future is now, and it's in IMAX.",
            bio: "Indian IT guy who built our entire digital infrastructure. Prada ensures our movie nights run smoothly with cutting-edge tech and has an eye for the best sci-fi films."
        },
        {
            id: 3,
            name: "Jimin",
            role: "K-Cinema Specialist",
            location: "Korea",
            profileImg: "🎬",
            speciality: "Korean Cinema",
            favoriteGenre: "Psychological Thrillers",
            moviesWatched: 3156,
            memberSince: "Founding Member",
            quote: "Every frame tells a story, every story touches a heart.",
            bio: "Korean movie specialist who introduced us to the masterpieces of Bong Joon-ho, Park Chan-wook, and beyond. Jimin's expertise in Asian cinema has expanded our horizons."
        },
        {
            id: 4,
            name: "Lev",
            role: "International Mystery",
            location: "Classified",
            profileImg: "🕵️",
            speciality: "Spy Thrillers & Noir",
            favoriteGenre: "Espionage",
            moviesWatched: "Classified",
            memberSince: "Founding Member",
            quote: "The best movies are the ones that keep secrets.",
            bio: "Russian spy who defected to the Film Club. Lev's mysterious past adds intrigue to our group, and his knowledge of international spy thrillers is unmatched."
        },
        {
            id: 5,
            name: "Cati",
            role: "Club Therapist",
            location: "Germany",
            profileImg: "🧠",
            speciality: "Psychological Thrillers",
            favoriteGenre: "Mind-Bending Films",
            moviesWatched: 2134,
            memberSince: "Founding Member",
            quote: "Sometimes we need therapy after a Gaspar Noé film.",
            bio: "German representative and psychology student who ensures our mental well-being after intense movie sessions. Cati is there to treat members in case of mental breakdowns from particularly disturbing films, and her insights into psychological thrillers add depth to our discussions."
        }
    ],
    
    // Page configuration
    pageSettings: {
        showStats: true,
        showQuotes: true,
        showMemberSince: true,
        animateOnScroll: true,
        showFloatingElements: true
    },
    
    // UI Messages
    messages: {
        heroTitle: "FOUNDING MEMBERS",
        heroSubtitle: "Meet the visionaries who started it all",
        statsTitle: "🏆 CLUB STATISTICS",
        noMembersFound: "No members found.",
        joinMessage: "Together, we're more than a movie club. We're a family united by our love for cinema.",
        statsHighlight: "Every week, we gather to explore new worlds through film."
    },
    
    // Club statistics
    clubStats: {
        totalMoviesWatched: 847,
        marathonsHosted: 156,
        genresExplored: 42,
        countriesRepresented: 5
    }
};

// Helper function to get all members
function getAllMembers() {
    return MEMBERS_CONFIG.members;
}

// Helper function to get member by ID
function getMemberById(id) {
    return MEMBERS_CONFIG.members.find(member => member.id === id);
}

// Helper function to get member by name
function getMemberByName(name) {
    return MEMBERS_CONFIG.members.find(member => 
        member.name.toLowerCase() === name.toLowerCase()
    );
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MEMBERS_CONFIG;
}
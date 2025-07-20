// GooseFilms Founding Members Configuration
const MEMBERS_CONFIG = {
    // Founding members data
    members: [
        {
            id: 1,
            name: "Camelia",
            role: "Film Expert",
            location: "Iași, Romania",
            profileImg: "assets/camelia.jpeg",
            speciality: "European Cinema",
            favoriteGenre: "Art House",
            favoriteGenres: ["Art House", "European Cinema", "Documentary"],
            moviesWatched: 0,
            memberSince: "Founding Member",
            quote: "Cinema is the mirror of culture and soul.",
            bio: "A film expert from Iași, Romania with an encyclopedic knowledge of European and world cinema. Camelia brings sophisticated taste and deep analytical insights to our movie selections."
        },
        {
            id: 2,
            name: "Prada",
            role: "Tech Mastermind",
            location: "India",
            profileImg: "assets/prada.jpeg",
            speciality: "Sci-Fi & Tech Thrillers",
            favoriteGenre: "Science Fiction",
            favoriteGenres: ["Science Fiction", "Tech Thrillers", "Cyberpunk"],
            moviesWatched: 0,
            memberSince: "Founding Member",
            quote: "The future is now, and it's in IMAX.",
            bio: "Indian IT guy who built our entire digital infrastructure. Prada ensures our movie nights run smoothly with cutting-edge tech and has an eye for the best sci-fi films."
        },
        {
            id: 3,
            name: "Jimin",
            role: "K-Cinema Specialist",
            location: "Korea",
            profileImg: "assets/jimin.jpeg",
            speciality: "Korean Cinema",
            favoriteGenre: "Psychological Thrillers",
            favoriteGenres: ["Korean Cinema", "Psychological Thrillers", "Crime Drama"],
            moviesWatched: 0,
            memberSince: "Founding Member",
            quote: "Every frame tells a story, every story touches a heart.",
            bio: "Korean movie specialist who introduced us to the masterpieces of Bong Joon-ho, Park Chan-wook, and beyond. Jimin's expertise in Asian cinema has expanded our horizons."
        },
        {
            id: 4,
            name: "White Horse",
            role: "International Mystery",
            location: "Moldova 🇲🇩",
            profileImg: "assets/white_horse.jpeg",
            speciality: "Spy Thrillers & Noir",
            favoriteGenre: "Espionage",
            favoriteGenres: ["Spy Thrillers", "Film Noir", "Eastern European Cinema"],
            moviesWatched: 0,
            memberSince: "Founding Member",
            quote: "The best movies are the ones that keep secrets.",
            bio: "Mysterious figure from Moldova who defected to the Film Club. White Horse's enigmatic past adds intrigue to our group, and their knowledge of international spy thrillers and Eastern European cinema is unmatched."
        },
        {
            id: 5,
            name: "Cati",
            role: "Club Therapist",
            location: "Germany",
            profileImg: "assets/cati.png",
            speciality: "Psychological Thrillers",
            favoriteGenre: "Mind-Bending Films",
            favoriteGenres: ["Psychological Horror", "German Expressionism", "Surrealism"],
            moviesWatched: 0,
            memberSince: "Founding Member",
            quote: "Sometimes we need therapy after a Gaspar Noé film.",
            bio: "German representative and psychology student who ensures our mental well-being after intense movie sessions. Cati is there to treat members in case of mental breakdowns from particularly disturbing films, and her insights into psychological thrillers add depth to our discussions."
        },
        {
            id: 6,
            name: "Lev",
            role: "Former KGB Film Analyst",
            location: "Russia 🇷🇺",
            profileImg: "assets/lev.jpeg",
            speciality: "Soviet & Russian Cinema",
            favoriteGenre: "Cold War Thrillers",
            favoriteGenres: ["Soviet Cinema", "Cold War Thrillers", "Russian Art Films"],
            moviesWatched: 0,
            memberSince: "Founding Member",
            quote: "In Soviet Russia, movie watches you.",
            bio: "A mysterious Russian spy who defected to GooseFilms, bringing with him classified knowledge of Soviet-era cinema and an unparalleled collection of rare Eastern Bloc films. Lev's shadowy past as a KGB film analyst gives him unique insights into propaganda films and psychological warfare through cinema. His defection story remains classified, but his passion for film is undeniable."
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
        countriesRepresented: 6
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

// Helper function to get fun facts
function getFunFacts() {
    return [
        {
            icon: "🎬",
            title: "Total Movies",
            value: MEMBERS_CONFIG.clubStats.totalMoviesWatched
        },
        {
            icon: "🍿",
            title: "Movie Marathons",
            value: MEMBERS_CONFIG.clubStats.marathonsHosted
        },
        {
            icon: "🎭",
            title: "Genres Explored",
            value: MEMBERS_CONFIG.clubStats.genresExplored
        },
        {
            icon: "🌍",
            title: "Countries",
            value: MEMBERS_CONFIG.clubStats.countriesRepresented
        }
    ];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MEMBERS_CONFIG;
}
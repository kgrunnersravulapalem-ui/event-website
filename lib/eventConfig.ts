export const eventConfig = {
    eventName: "KONASEEMA RUN",
    eventDate: "2026-02-08T05:30:00", // ISO format for easy parsing
    location: "Sri Potamsetti Rami Reddy Park, Ravulapalem, Konaseema Dist, Andhra Pradesh - 533238",
    highlightText: "Registrations are now open! Secure your spot for the ultimate coastal run. Early bird prices end soon!",
    contactEmail: "kgrunnersravulapalem@gmail.com",
    socials: {
        facebook: "#",
        instagram: "#",
        twitter: "#",
    },

    // About Section
    about: {
        title: "About The Run",
        paragraphs: [
            'Join us for the most anticipated running event of the year! The "KONASEEMA RUN" is not just a race; it\'s a celebration of health, community, and the human spirit. Organized by running enthusiasts for running enthusiasts. Powered by "Konaseema Godavari Runners Society - Ravulapalem"',
            'Our motto "Health is Wealth" embodies our belief that running connects us all. Whether you are aiming for a personal best or just here for the fun, we have a spot for you.',
        ],
        motto: "Health is Wealth",
        teluguMotto: "మన ఆరోగ్యం, మన ఊరు, మన భాధ్యత",
        yearMotto: "OUR HEALTH, OUR VILLAGE, OUR RESPONSIBILITY",
        year: "2026",
    },

    // Contact Section
    contact: {
        title: "Contact Us",
        subtitle: "We'd love to hear from you.",
        heading: "Get in Touch",
        description: "Have questions about registration, the route, or sponsorship? We're here to help.",
        email: "kgrunnersravulapalem@gmail.com",
        phones: ["9494847967", "9849129557"],
        location: {
            line1: "Sri Potamsetti Rami Reddy Park,",
            line2: "Ravulapalem, Konaseema Dist, Andhra Pradesh - 533238",
        },
    },

    // Registration & Prize Information
    registration: {
        deadline: "10 JAN 2026",
        entryFee: 300,
        prizeMoney: {
            total: 60000,
            above18: 36000,
            below18: 24000,
        },
        ageCategories: {
            above18: {
                label: "Above 18 years",
                dobCriteria: "DOB ON OR BEFORE: 07/02/2008",
            },
            below18: {
                label: "Below 18 years",
                dobCriteria: "DOB ON OR AFTER: 08/02/2008",
            },
        },
    },

    // Race Categories
    raceCategories: {
        title: "Race Categories",
        subtitle: "Choose your challenge. Experience the thrill.",
        categories: [
            {
                id: "10k",
                distance: "10K",
                desc: "Push beyond the Your limits. A challenging middle distance.",
                color: "#ef4444", // Red
                price: 300, // Update with actual price
                routeImage: "/images/routes/10k-route.jpg", // Placeholder - will be updated later
            },
            {
                id: "5k",
                distance: "5K",
                desc: "The classic distance redefined. Fast, scenic, and exhilarating.",
                color: "#f97316", // Orange
                price: 300, // Update with actual price
                routeImage: "/images/routes/5k-route.jpg", // Placeholder - will be updated later
            },
            {
                id: "3km",
                distance: "3 Km",
                desc: "Short, sweet, and spirited. Great for beginners & speedsters.",
                color: "#22c55e", // Green
                price: 300, // Update with actual price
                routeImage: "/images/routes/3km-route.jpg", // Placeholder - will be updated later
            },
        ],
    },

    // Form Options
    formOptions: {
        genders: ["Male", "Female", "Other"],
        tshirtSizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
};

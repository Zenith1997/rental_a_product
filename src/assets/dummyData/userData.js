export const user = {
    id: 2,
    username: 'John Doe',
    password: 123456,
    email: 'john@example.com',
    image: 'https://static.vecteezy.com/system/resources/previews/030/798/360/non_2x/beautiful-asian-girl-wearing-over-size-hoodie-in-casual-style-ai-generative-photo.jpg',
    about: `Most people know me as an actor or writer, but some of you may also know me as a pottery enthusiast 
who puts gloops and globs on nearly every orb or vase I create.I’m drawn to unique designs that bring nostalgia
into futuristic styles, which is a big part of what we’ve created at Houseplant.And hey, there’s so much 
more that I can share with you wheel- side when you book this Airbnb!`,
    address: 'Melbourne, AUS',
    reviews: [
        {
            id: 1,
            date: "2024/11/05 10:30",
            username: "Ethan Harris",
            profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
            rate: 4,
            comment: "lso know me as a pottery enthusiast  who puts gloops and globs on nearly every orb or vase I create.I’m drawn to unique designs that bring nostalgia into futuristic styles, ",
        },
        {
            id: 2,
            date: "2024/11/07 16:45",
            username: "Emma Collins",
            profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
            rate: 5,
            comment: "lso know me as a pottery enthusiast  who puts gloops and globs on nearly every orb or vase I create.I’m drawn to unique designs that bring nostalgia into futuristic styles, ",
        }
    ],

    list: [
        {
            id: 1,
            name: "Lamborghini Aventador",
            price: 1200,
            ratings: 4.9,
            reviews: [
                {
                    id: 1,
                    date: "2024/11/10 12:26",
                    username: "Mark Rahuman",
                    profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                    rate: 4,
                    comment: "Amazing car! Perfect for a luxury experience.",
                },
                {
                    id: 2,
                    date: "2024/11/08 14:20",
                    username: "Sophia Carter",
                    profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                    rate: 5,
                    comment: "w me as an actor or writer, but some of you may also know me as a pottery enthusiast  who puts gloops and globs on nearly every orb or vase I create.I’m drawn to unique designs that bring nostalgia into futuristic styles, ",
                }
            ],
            postedBy: {
                username: "John Doe",
                profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                date: "2024/10/03 12:26",
            },
            image_url: [
                "https://wallpapers.com/images/featured/lamborghini-lbun8b8ehlv3j8to.jpg",
                "https://www.shutterstock.com/image-photo/batmobile-racing-down-gotham-bat-600nw-2493993133.jpg",
                "https://wallpapercave.com/wp/wp2633126.jpg",
                "https://img.pikbest.com/origin/09/20/01/43kpIkbEsTXWQ.jpg!sw800",
                "https://static.vecteezy.com/system/resources/previews/032/239/229/non_2x/the-house-in-the-mountains-ai-generated-free-photo.jpg",
            ],
            category: "car & vehicle",
            address: "1012 Ocean Avenue, New York, USA",
            description: `
            Indulge in the epitome of luxury and performance with the 2022 Lamborghini Aventador. 
            Perfect for luxury travel or special occasions.`,
            condition: "Brand New",
            brand: "Lamborghini",
            model: "Aventador",
            year: 2022,
        },
        {
            id: 2,
            name: "Classic Ford Mustang",
            price: 800,
            ratings: 4.7,
            reviews: [
                {
                    id: 1,
                    date: "2024/11/05 10:30",
                    username: "Ethan Harris",
                    profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                    rate: 4,
                    comment: "A classic ride! Loved the retro vibes.",
                },
                {
                    id: 2,
                    date: "2024/11/07 16:45",
                    username: "Emma Collins",
                    profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                    rate: 5,
                    comment: "Mustang fan forever! Smooth handling and powerful engine.",
                }
            ],
            postedBy: {
                username: "Jane Smith",
                profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                date: "2024/10/01 15:30",
            },
            image_url: [
                "https://wallpapercave.com/wp/wp2633126.jpg",
                "https://www.shutterstock.com/image-photo/batmobile-racing-down-gotham-bat-600nw-2493993133.jpg",
                "https://wallpapers.com/images/featured/lamborghini-lbun8b8ehlv3j8to.jpg",
                "https://img.pikbest.com/origin/09/20/01/43kpIkbEsTXWQ.jpg!sw800",
                "https://static.vecteezy.com/system/resources/previews/032/239/229/non_2x/the-house-in-the-mountains-ai-generated-free-photo.jpg",
            ],
            category: "car & vehicle",
            address: "350 Main Street, Chicago, USA",
            description: "Drive the legend! Rent this classic Ford Mustang for a retro ride.",
            condition: "Good Condition",
            brand: "Ford",
            model: "Mustang",
            year: 1969,
        },
        {
            id: 3,
            name: "Batmobile",
            price: 3000,
            ratings: 5.0,
            reviews: [
                {
                    id: 1,
                    date: "2024/11/03 18:00",
                    username: "Bruce Wayne",
                    profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                    rate: 5,
                    comment: "The best ride for any vigilante! Thrilling experience.",
                },
                {
                    id: 2,
                    date: "2024/11/04 14:15",
                    username: "Clark Kent",
                    profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                    rate: 5,
                    comment: "Nothing beats the Batmobile. Absolutely loved it!",
                }
            ],
            postedBy: {
                username: "Alfred Pennyworth",
                profile_image: "https://wallpapercave.com/wp/wp2633126.jpg",
                date: "2024/09/20 10:00",
            },
            image_url: [
                "https://www.shutterstock.com/image-photo/batmobile-racing-down-gotham-bat-600nw-2493993133.jpg",
                "https://wallpapers.com/images/featured/lamborghini-lbun8b8ehlv3j8to.jpg",
                "https://img.pikbest.com/origin/09/20/01/43kpIkbEsTXWQ.jpg!sw800",
                "https://static.vecteezy.com/system/resources/previews/032/239/229/non_2x/the-house-in-the-mountains-ai-generated-free-photo.jpg",
                "https://wallpapercave.com/wp/wp2633126.jpg",
            ],
            category: "car & vehicle",
            address: "Wayne Manor, Gotham City, USA",
            description: "Experience the thrill of Gotham's most iconic ride, the Batmobile.",
            condition: "Custom Build",
            brand: "Wayne Enterprises",
            model: "Tumbler",
            year: 2022,
        },
    ]
}
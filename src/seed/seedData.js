import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

const MOVIES = [
   {
      "adult": false,
      "backdrop_path": "/e4OnHU8HNAhdS6C4Ypk6NA26kPQ.jpg",
      "genre_ids": [28, 35, 80],
      "id": 1168190,
      "original_language": "en",
      "original_title": "The Wrecking Crew",
      "overview": "Estranged half-brothers Jonny and James reunite after their father's mysterious death. As they search for the truth, buried secrets reveal a conspiracy threatening to tear their family apart.",
      "popularity": 761.4033,
      "poster_path": "/gbVwHl4YPSq6BcC92TQpe7qUTh6.jpg",
      "release_date": "2026-01-28",
      "title": "The Wrecking Crew",
      "video": false,
      "vote_average": 6.7,
      "vote_count": 309
    },
    {
      "adult": false,
      "backdrop_path": "/tyjXlexbNZQ0ZT1KEJslQtBirqc.jpg",
      "genre_ids": [12, 53, 878],
      "id": 840464,
      "original_language": "en",
      "original_title": "Greenland 2: Migration",
      "overview": "Having found the safety of the Greenland bunker after the comet Clarke decimated the Earth, the Garrity family must now risk everything to embark on a perilous journey across the wasteland of Europe to find a new home.",
      "popularity": 677.7898,
      "poster_path": "/1mF4othta76CEXcL1YFInYudQ7K.jpg",
      "release_date": "2026-01-07",
      "title": "Greenland 2: Migration",
      "video": false,
      "vote_average": 6.474,
      "vote_count": 287
    },
    {
      "adult": false,
      "backdrop_path": "/5h2EsPKNDdB3MAtOk9MB9Ycg9Rz.jpg",
      "genre_ids": [16, 35, 12, 10751, 9648],
      "id": 1084242,
      "original_language": "en",
      "original_title": "Zootopia 2",
      "overview": "After cracking the biggest case in Zootopia's history, rookie cops Judy Hopps and Nick Wilde find themselves on the twisting trail of a great mystery when Gary De'Snake arrives and turns the animal metropolis upside down. To crack the case, Judy and Nick must go undercover to unexpected new parts of town, where their growing partnership is tested like never before.",
      "popularity": 370.855,
      "poster_path": "/oJ7g2CifqpStmoYQyaLQgEU32qO.jpg",
      "release_date": "2025-11-26",
      "title": "Zootopia 2",
      "video": false,
      "vote_average": 7.6,
      "vote_count": 1485
    },
    {
      "adult": false,
      "backdrop_path": "/4BtL2vvEufDXDP4u6xQjjQ1Y2aT.jpg",
      "genre_ids": [28, 80, 18, 53],
      "id": 1419406,
      "original_language": "zh",
      "original_title": "捕风追影",
      "overview": "Macau Police brings the tracking expert police officer out of retirement to help catch a dangerous group of professional thieves.",
      "popularity": 359.6419,
      "poster_path": "/e0RU6KpdnrqFxDKlI3NOqN8nHL6.jpg",
      "release_date": "2025-08-16",
      "title": "The Shadow's Edge",
      "video": false,
      "vote_average": 7.2,
      "vote_count": 388
    },
    {
      "adult": false,
      "backdrop_path": "/swxhEJsAWms6X1fDZ4HdbvYBSf9.jpg",
      "genre_ids": [12, 35, 27],
      "id": 1234731,
      "original_language": "en",
      "original_title": "Anaconda",
      "overview": "A group of friends facing mid-life crises head to the rainforest with the intention of remaking their favorite movie from their youth, only to find themselves in a fight for their lives against natural disasters, giant snakes and violent criminals.",
      "popularity": 247.4222,
      "poster_path": "/qxMv3HwAB3XPuwNLMhVRg795Ktp.jpg",
      "release_date": "2025-12-24",
      "title": "Anaconda",
      "video": false,
      "vote_average": 5.851,
      "vote_count": 432
    },
    {
      "adult": false,
      "backdrop_path": "/lAtuFCx6cYkNBmTMSNnLE0qlCLx.jpg",
      "genre_ids": [28, 80, 10749],
      "id": 1271895,
      "original_language": "zh",
      "original_title": "96分鐘",
      "overview": "Former bomb disposal expert, Song Kang-Ren, and his fiancée, Huang Xin, board a high-speed train that contains a bomb. At the same time, Liu Kai, a well-known physics teacher who was involved in an affair scandal, also boards this same train in order to win back his wife, Ting Juan, who took the prior high-speed rail to return home in frustration…  After all, can the bomb be successfully defused this time? and resolve the crisis?",
      "popularity": 238.0953,
      "poster_path": "/gWKZ1iLhukvLoh8XY2N4tMvRQ2M.jpg",
      "release_date": "2025-09-05",
      "title": "96 Minutes",
      "video": false,
      "vote_average": 6.381,
      "vote_count": 21
    },
    {
      "adult": false,
      "backdrop_path": "/6D6M5z4reppUxo2cnBEKI02Csp1.jpg",
      "genre_ids": [28, 80, 53],
      "id": 1601243,
      "original_language": "en",
      "original_title": "Oscar Shaw",
      "overview": "After retiring from the police force, a relentless detective haunted by the tragic loss of his closest friend sets out on a perilous quest for vengeance, seeking redemption and fighting to restore justice to the streets he once swore to protect.",
      "popularity": 238.7457,
      "poster_path": "/tsE3nySukwrfUjouz8vzvKTcXNC.jpg",
      "release_date": "2026-01-09",
      "title": "Oscar Shaw",
      "video": false,
      "vote_average": 5.833,
      "vote_count": 12
    },
    {
      "adult": false,
      "backdrop_path": "/gLXibzLQ4qegvjdqDC0f8yTij2P.jpg",
      "genre_ids": [9648, 53, 28],
      "id": 1310568,
      "original_language": "en",
      "original_title": "Murder at the Embassy",
      "overview": "1934. Private detective Miranda Green investigates a murder perpetrated in the British Embassy in Cairo, where a top secret document was stolen, risking to jeopardize both Buckingham Palace and the peace of the world. All those present in this closed place are suspected: the American photographer, the English student, the American actress, the Egyptian security guard, the ambassador interpreter, the Egyptian gardener and - why not? — the Ambassador himself. But who would have expected that a small group of Nazis would be behind a plot, risking to jeopardize both Buckingham Palace and the peace of the world?",
      "popularity": 229.7887,
      "poster_path": "/3DBmBItPdy0A2ol59jgHhS54Lua.jpg",
      "release_date": "2025-11-14",
      "title": "Murder at the Embassy",
      "video": false,
      "vote_average": 5.517,
      "vote_count": 30
    },
    {
      "adult": false,
      "backdrop_path": "/tNONILTe9OJz574KZWaLze4v6RC.jpg",
      "genre_ids": [9648, 53],
      "id": 1368166,
      "original_language": "en",
      "original_title": "The Housemaid",
      "overview": "Trying to escape her past, Millie Calloway accepts a job as a live-in housemaid for the wealthy Nina and Andrew Winchester. But what begins as a dream job quickly unravels into something far more dangerous—a sexy, seductive game of secrets, scandal, and power.",
      "popularity": 226.366,
      "poster_path": "/cWsBscZzwu5brg9YjNkGewRUvJX.jpg",
      "release_date": "2025-12-18",
      "title": "The Housemaid",
      "video": false,
      "vote_average": 7.075,
      "vote_count": 626
    },
    {
      "adult": false,
      "backdrop_path": "/eUERZRVjCTNdgnESlQxyaOJ2d4K.jpg",
      "genre_ids": [28],
      "id": 1584215,
      "original_language": "en",
      "original_title": "The Internship",
      "overview": "A CIA-trained assassin recruits other graduates from her secret childhood program, The Internship, to violently destroy the organization. The CIA fights back with deadly force.",
      "popularity": 218.4812,
      "poster_path": "/fYqSOkix4rbDiZW0ACNnvZCpT6X.jpg",
      "release_date": "2026-01-13",
      "title": "The Internship",
      "video": false,
      "vote_average": 6.1,
      "vote_count": 36
    },
    {
      "adult": false,
      "backdrop_path": "/ebyxeBh56QNXxSJgTnmz7fXAlwk.jpg",
      "genre_ids": [28, 878, 12],
      "id": 1242898,
      "original_language": "en",
      "original_title": "Predator: Badlands",
      "overview": "Cast out from his clan, a young Predator finds an unlikely ally in a damaged android and embarks on a treacherous journey in search of the ultimate adversary.",
      "popularity": 165.6074,
      "poster_path": "/pHpq9yNUIo6aDoCXEBzjSolywgz.jpg",
      "release_date": "2025-11-05",
      "title": "Predator: Badlands",
      "video": false,
      "vote_average": 7.756,
      "vote_count": 1783
    },
    {
      "adult": false,
      "backdrop_path": "/u8DU5fkLoM5tTRukzPC31oGPxaQ.jpg",
      "genre_ids": [878, 12, 14],
      "id": 83533,
      "original_language": "en",
      "original_title": "Avatar: Fire and Ash",
      "overview": "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
      "popularity": 168.9763,
      "poster_path": "/5bxrxnRaxZooBAxgUVBZ13dpzC7.jpg",
      "release_date": "2025-12-17",
      "title": "Avatar: Fire and Ash",
      "video": false,
      "vote_average": 7.295,
      "vote_count": 1680
    },
    {
      "adult": false,
      "backdrop_path": "/3F2EXWF1thX0BdrVaKvnm6mAhqh.jpg",
      "genre_ids": [28, 53, 80],
      "id": 1306368,
      "original_language": "en",
      "original_title": "The Rip",
      "overview": "Trust frays when a team of Miami cops discovers millions in cash inside a run-down stash house, calling everyone — and everything — into question.",
      "popularity": 152.5968,
      "poster_path": "/eZo31Dhl5BQ6GfbMNf3oU0tUvPZ.jpg",
      "release_date": "2026-01-13",
      "title": "The Rip",
      "video": false,
      "vote_average": 7.023,
      "vote_count": 1025
    },
    {
      "adult": false,
      "backdrop_path": "/oN4TQ1TxchynXlFiXFBL3NHLT54.jpg",
      "genre_ids": [16, 10751, 18],
      "id": 1167307,
      "original_language": "en",
      "original_title": "David",
      "overview": "From the songs of his mother’s heart to the whispers of a faithful God, David’s story begins in quiet devotion. When the giant Goliath rises to terrorize a nation, a young shepherd armed with only a sling, a few stones, and unshakable faith steps forward. Pursued by power and driven by purpose, his journey tests the limits of loyalty, love, and courage—culminating in a battle not just for a crown, but for the soul of a kingdom.",
      "popularity": 146.6882,
      "poster_path": "/bESlrLOrsQ9gKzaGQGHXKOyIUtX.jpg",
      "release_date": "2025-12-14",
      "title": "David",
      "video": false,
      "vote_average": 8.135,
      "vote_count": 63
    },
    {
      "adult": false,
      "backdrop_path": "/AecGG1XVCmkk7fT10ko3FC0dLIP.jpg",
      "genre_ids": [28, 14, 53],
      "id": 1043197,
      "original_language": "en",
      "original_title": "Dust Bunny",
      "overview": "Ten-year-old Aurora asks her hitman neighbor to kill the monster under her bed that she claims ate her family. To protect her, he must battle an onslaught of assassins while accepting that some monsters are real.",
      "popularity": 110.3252,
      "poster_path": "/vobigFZFvbYPf6ElYJu07P9rH8C.jpg",
      "release_date": "2025-12-11",
      "title": "Dust Bunny",
      "video": false,
      "vote_average": 6.616,
      "vote_count": 144
    },
    {
      "adult": false,
      "backdrop_path": "/iZLqwEwUViJdSkGVjePGhxYzbDb.jpg",
      "genre_ids": [878, 53],
      "id": 755898,
      "original_language": "en",
      "original_title": "War of the Worlds",
      "overview": "Will Radford is a top analyst for Homeland Security who tracks potential threats through a mass surveillance program, until one day an attack by an unknown entity leads him to question whether the government is hiding something from him... and from the rest of the world.",
      "popularity": 114.6094,
      "poster_path": "/yvirUYrva23IudARHn3mMGVxWqM.jpg",
      "release_date": "2025-07-29",
      "title": "War of the Worlds",
      "video": false,
      "vote_average": 4.217,
      "vote_count": 875
    },
    {
      "adult": false,
      "backdrop_path": "/eyvIBnJSxZDyek4s7YytUNmtstR.jpg",
      "genre_ids": [27, 53, 35],
      "id": 1198994,
      "original_language": "en",
      "original_title": "Send Help",
      "overview": "Two colleagues become stranded on a deserted island, the only survivors of a plane crash. On the island, they must overcome past grievances and work together to survive, but ultimately, it's a battle of wills and wits to make it out alive.",
      "popularity": 117.8711,
      "poster_path": "/mlV70IuchLZXcXKowjwSpSfdfUB.jpg",
      "release_date": "2026-01-22",
      "title": "Send Help",
      "video": false,
      "vote_average": 7,
      "vote_count": 134
    },
    {
      "adult": false,
      "backdrop_path": "/kVSUUWiXoNwq2wVCZ4Mcqkniqvr.jpg",
      "genre_ids": [16, 10751, 35, 12, 14],
      "id": 991494,
      "original_language": "en",
      "original_title": "The SpongeBob Movie: Search for SquarePants",
      "overview": "Desperate to be a big guy, SpongeBob sets out to prove his bravery to Mr. Krabs by following The Flying Dutchman – a mysterious swashbuckling ghost pirate – on a seafaring adventure that takes him to the deepest depths of the deep sea, where no Sponge has gone before.",
      "popularity": 96.391,
      "poster_path": "/pDWYW9v8fmJdA7N0I1MOdQA3ETq.jpg",
      "release_date": "2025-12-16",
      "title": "The SpongeBob Movie: Search for SquarePants",
      "video": false,
      "vote_average": 6.709,
      "vote_count": 163
    },
    {
      "adult": false,
      "backdrop_path": "/xGbNoh7aWmU81oYuxJoFI07Rz5I.jpg",
      "genre_ids": [28, 53, 80],
      "id": 1326878,
      "original_language": "en",
      "original_title": "Strangers",
      "overview": "Seeking revenge on her abusive husband, a woman's life takes a dark turn when she meets a mysterious hitman. Drawn into a whirlwind romance, she spirals into a dangerous vigilante spree. As the body count rises, she begins to unravel the true nature of her partner and the secrets they both conceal.",
      "popularity": 87.3379,
      "poster_path": "/v6hYeC1asK2ZRU7Ygukn4tV1zlS.jpg",
      "release_date": "2024-08-16",
      "title": "Strangers",
      "video": false,
      "vote_average": 5.8,
      "vote_count": 29
    },
    {
      "adult": false,
      "backdrop_path": "/kv8kCuvfhSQ50YxjowqpVn1QqhJ.jpg",
      "genre_ids": [27, 53],
      "id": 801937,
      "original_language": "en",
      "original_title": "Silent Night, Deadly Night",
      "overview": "After witnessing his parents' brutal murder on Christmas Eve, Billy transforms into a Killer Santa, delivering a yearly spree of calculated, chilling violence. This year, his blood-soaked mission collides with love, as a young woman challenges him to confront his darkness.",
      "popularity": 88.5697,
      "poster_path": "/xCdSd7NnRdnL8DGLVhI95WhUNoi.jpg",
      "release_date": "2025-12-11",
      "title": "Silent Night, Deadly Night",
      "video": false,
      "vote_average": 6.254,
      "vote_count": 61
    }
];

const THEATRE_IDS = [
  "be55f4f8-99f5-4d3d-aa5d-c7ae0196e9b9",
  "0f86d817-6403-4b89-95a1-0f12e3efbd7f",
  "8f51e529-03c0-4560-a6bc-a9fe8172dd58",                   
"68b82486-7bba-46e0-b7b8-ac741cdf6634",

  "f94b01cd-dd9d-40c4-82fc-4d2332bf23eb",

"c088818f-4473-44fb-8940-e1727d2298ff",

"d676ac70-2111-4931-bbf6-1826102959e1",

"5d0d7900-e7d1-4004-8ac0-75ffe8441fa9",
"75aae289-1bed-4f6d-92ad-f988ec964a6c",

"61c2c9e0-80b9-4a21-a6c4-787adbfaf634"
]

const THEATRES = [{
    id: THEATRE_IDS[0],
    name: "Cineplex Downtown",
    location: "123 Main St, Cityville",
    
}
,{
    id: THEATRE_IDS[1],
    name: "Grand Cinema",
    location: "456 Elm St, Townsville", 
},
{
    id: THEATRE_IDS[2],
    name: "Movie Palace",
    location: "789 Oak St, Villagetown"
},
{
  id: THEATRE_IDS[3],
  name: "Star Theater",
  location: "321 Pine St, Metropolis"
},
{
id: THEATRE_IDS[4],
name: "Galaxy Cinemas",
location: "654 Maple St, Urbania"
},
{
id: THEATRE_IDS[5],
name: "Epic Theaters",  
location: "987 Cedar St, Suburbia"
},
{
id: THEATRE_IDS[6],  
name: "Cinema World",
location: "147 Birch St, Hometown"
},
{
id: THEATRE_IDS[7],
name: "Silver Screen",
location: "258 Spruce St, Riverside"
},
{
id: THEATRE_IDS[8],
name: "Royal Theater",
location: "369 Willow St, Capital City"
},{
id: THEATRE_IDS[9],
name: "Majestic Cinemas",
location: "159 Chestnut St, Lakeview"
}
];

const SHOWTIMES = [
    {
        id: "st1",
        movieId: MOVIES[0].id,
        theatreId: THEATRES[0].id,
        time: "18:00",
     
    },
    {
        id: "st2",
        movieId: MOVIES[1].id,
        theatreId: THEATRES[1].id,
        time: "20:30",
      
    },
    {
        id: "st3",
        movieId: MOVIES[2].id,
        theatreId: THEATRES[2].id,
        time: "19:45",
       
    }
];

function generateSeats(showTimeId){
    const seats = [];
    const rows = ['A','B','C','D','E','F','G','H','I','J'];
    rows.forEach(row=>{
        for(let col = 1 ; col <= 10; col++){
            seats.push({
                id: `${showTimeId}_${row}${col}`,
                showTimeId: showTimeId,
                seatId: `${row}${col}`,
                status: 'available',
                lockedBy: null,
                lockedAt: null,
                bookingId: null,
                type: (row === 'A' || row === 'B') ? "VIP" : "regular"
            })
        }
    })
    return seats;

}



//sead data store

export async function seedFirestore() {
    const movieRef = collection(db, "movies");
    const existingMovies = await getDocs(movieRef);
    // TODO check if we aleady have that movie
    if (existingMovies.size > 0) {
        console.log("Movies already seeded");
        return;
    }
    //if empty, we will seed the data
    console.log("Starting the Seeding  process...")
    for (const movie of MOVIES) {
        await setDoc(doc(db, "movies", movie.id.toString()), movie);
    }



    console.log("seeding process complete...")
     for (const theatre of THEATRES){
        await setDoc(doc(db, "theatres", theatre.id), theatre);
     }
     console.log("Theatres seeded")
     for (const show of SHOWTIMES){
        await setDoc(doc(db, "showtimes", show.id), show);
     }
     for (const show of SHOWTIMES){
        const seats = generateSeats(show.id);
        await setDoc(doc(db, "seats", `${show.id}_seats`), {seats});
     }

     console.log("seats created")
     console.log("seeding complete on Firebase !!!")
}
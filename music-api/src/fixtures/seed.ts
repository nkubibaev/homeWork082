import mongoose from 'mongoose';
import config from '../config.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Track from '../models/Track.js';

const run = async () => {
    await mongoose.connect(config.mongoDbUrl);
    const db = mongoose.connection;

    try {
        await db.dropCollection('tracks');
        await db.dropCollection('albums');
        await db.dropCollection('artists');
    } catch (e) {
        console.log('Collections were not present, skipping drop.');
    }

    const [ eminem, snoopDogg ] = await Artist.create(
        {
            name: 'Eminem',
            photo: '/images/eminem.jpeg',
            information:
                'American rapper, songwriter and record producer.',
        },
        {
            name: 'Snoop Dogg',
            photo: '/images/SnoopDogg.jpg',
            information:
                'American rapper, songwriter and actor.',
        },
    );

    const [ slimShadyLP, marshallMathersLP, doggystyle, thaLastMeal ] = await Album.create(
        {
            name: 'The Slim Shady LP',
            artist: eminem._id,
            year: 1999,
            image: '/images/slim-shady-lp.jpeg',
        },
        {
            name: 'The Marshall Mathers LP',
            artist: eminem._id,
            year: 2000,
            image: '/images/The_Marshall_Mathers_LP_Tour_Edition.jpeg',
        },
        {
            name: 'DoggyStyle',
            artist: snoopDogg._id,
            year: 1993,
            image: '/images/Doggystyle.jpeg',
        },
        {
            name: 'Tha Last Meal',
            artist: snoopDogg._id,
            year: 2000,
            image: '/images/Tha Last Meal.jpeg',
        },
    );

    await Track.create(
        {
            name: 'My Name Is',
            album: slimShadyLP._id,
            trackNumber: 1,
            duration: '4:28',
            youtubeUrl: 'https://www.youtube.com/watch?v=t4V-hlr8134&list=RDt4V-hlr8134&start_radio=1',
        },
        {
            name: 'Guilty Conscience',
            album: slimShadyLP._id,
            trackNumber: 2,
            duration: '3:19',
            youtubeUrl: null
        },
        {
            name: 'Brain Damage',
            album: slimShadyLP._id,
            trackNumber: 3,
            duration: '3:46',
            youtubeUrl: null
        },
        {
            name: 'Role Model',
            album: slimShadyLP._id,
            trackNumber: 4,
            duration: '3:25',
            youtubeUrl: null
        },
        {
            name: 'My Fault',
            album: slimShadyLP._id,
            trackNumber: 5,
            duration: '4:01',
            youtubeUrl: null
        },

        {
            name: 'Kill You',
            album: marshallMathersLP._id,
            trackNumber: 1,
            duration: '4:24',
            youtubeUrl: null
        },
        {
            name: 'Stan',
            album: marshallMathersLP._id,
            trackNumber: 2,
            duration: '6:44',
            youtubeUrl: null
        },
        {
            name: 'The Way I Am',
            album: marshallMathersLP._id,
            trackNumber: 3,
            duration: '4:50',
            youtubeUrl: null
        },
        {
            name: 'The Real Slim Shady',
            album: marshallMathersLP._id,
            trackNumber: 4,
            duration: '4:44',
            youtubeUrl: null
        },
        {
            name: "I'm Back",
            album: marshallMathersLP._id,
            trackNumber: 5,
            duration: '5:10',
            youtubeUrl: null
        },

        {
            name: 'Bathtub',
            album: doggystyle._id,
            trackNumber: 1,
            duration: '1:50',
            youtubeUrl: null
        },
        {
            name: 'G Funk Intro',
            album: doggystyle._id,
            trackNumber: 2,
            duration: '2:25',
            youtubeUrl: 'https://www.youtube.com/watch?v=vnPt_WB8A1U&list=RDvnPt_WB8A1U&start_radio=1'
        },
        {
            name: 'Gin and Juice',
            album: doggystyle._id,
            trackNumber: 3,
            duration: '3:31',
            youtubeUrl: null
        },
        {
            name: 'Who Am I (Whats My Name)?',
            album: doggystyle._id,
            trackNumber: 4,
            duration: '4:06',
            youtubeUrl: null
        },
        {
            name: 'For All My Niggaz & Bitches',
            album: doggystyle._id,
            trackNumber: 5,
            duration: '4:27',
            youtubeUrl: null
        },

        {
            name: 'Hennesey N Buddah',
            album: thaLastMeal._id,
            trackNumber: 1,
            duration: '3:30',
            youtubeUrl: null
        },
        {
            name: 'Snoop Dogg',
            album: thaLastMeal._id,
            trackNumber: 2,
            duration: '2:46',
            youtubeUrl: null
        },
        {
            name: 'True Lies',
            album: thaLastMeal._id,
            trackNumber: 3,
            duration: '4:04',
            youtubeUrl: null
        },
        {
            name: 'Wrong Idea',
            album: thaLastMeal._id,
            trackNumber: 4,
            duration: '3:52',
            youtubeUrl: null
        },
        {
            name: 'Set It Off',
            album: thaLastMeal._id,
            trackNumber: 5,
            duration: '4:30',
            youtubeUrl: null
        },
    );

    console.log('Fixtures created successfully');

    await db.close();
};

run().catch(console.error);
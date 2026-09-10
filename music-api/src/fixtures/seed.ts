import mongoose from 'mongoose';
import config from '../config.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Track from '../models/Track.js';
import User from '../models/User.js';
import { randomUUID } from 'node:crypto';

const ensureUsers = async () => {
    const existingUsers = await User.find();

    for (const currentUser of existingUsers) {
        let changed = false;

        if (currentUser.username === 'admin' && currentUser.role !== 'admin') {
            currentUser.role = 'admin';
            changed = true;
        }

        if (currentUser.username !== 'admin' && currentUser.role !== 'user') {
            currentUser.role = 'user';
            changed = true;
        }

        if (!currentUser.displayName) {
            currentUser.displayName = currentUser.username;
            changed = true;
        }

        if (!currentUser.avatar) {
            currentUser.avatar = null;
            changed = true;
        }

        if (!currentUser.googleID) {
            currentUser.googleID = null;
            changed = true;
        }

        if (changed) {
            await currentUser.save();
        }
    }

    let admin = await User.findOne({
        username: 'admin',
    });

    if (admin === null) {
        admin = await User.create({
            username: 'admin',
            password: 'admin',
            token: randomUUID(),
            role: 'admin',
            displayName: 'Administrator',
            avatar: null,
            googleID: null,
        });
    } else if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
    }

    let user = await User.findOne({
        username: 'user',
    });

    if (user === null) {
        user = await User.create({
            username: 'user',
            password: 'user',
            token: randomUUID(),
            role: 'user',
            displayName: 'Test User',
            avatar: null,
            googleID: null,
        });
    } else if (user.role !== 'user') {
        user.role = 'user';
        await user.save();
    }

    return {
        admin,
        user,
    };
};

const run = async () => {
    await mongoose.connect(config.mongoDbUrl);
    const db = mongoose.connection;

    try {
        await db.dropCollection('tracks');
        await db.dropCollection('albums');
        await db.dropCollection('artists');
    } catch (error) {
        console.log('Collections were not present, skipping drop.');
    }

    const { admin, user } = await ensureUsers();
    const [ eminem, snoopDogg, testArtist ] = await Artist.create(
        {
            name: 'Eminem',
            photo: '/images/eminem.jpeg',
            information: 'American rapper, songwriter and record producer.',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Snoop Dogg',
            photo: '/images/SnoopDogg.jpg',
            information: 'American rapper, songwriter and actor.',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Test Artist',
            photo: null,
            information: 'Unpublished artist fixture.',
            user: user._id,
            isPublished: false,
        },
    );
    const [ slimShadyLP, marshallMathersLP, doggystyle, thaLastMeal, testAlbum ] = await Album.create(
        {
            name: 'The Slim Shady LP',
            artist: eminem._id,
            year: 1999,
            image: '/images/slim-shady-lp.jpeg',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'The Marshall Mathers LP',
            artist: eminem._id,
            year: 2000,
            image:
                '/images/The_Marshall_Mathers_LP_Tour_Edition.jpeg',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'DoggyStyle',
            artist: snoopDogg._id,
            year: 1993,
            image: '/images/Doggystyle.jpeg',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Tha Last Meal',
            artist: snoopDogg._id,
            year: 2000,
            image: '/images/Tha Last Meal.jpeg',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Test Album',
            artist: testArtist._id,
            year: 2026,
            image: null,
            user: user._id,
            isPublished: false,
        },
    );

    await Track.create(
        {
            name: 'My Name Is',
            album: slimShadyLP._id,
            trackNumber: 1,
            duration: '4:28',
            youtubeUrl:
                'https://www.youtube.com/watch?v=t4V-hlr8134&list=RDt4V-hlr8134&start_radio=1',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Guilty Conscience',
            album: slimShadyLP._id,
            trackNumber: 2,
            duration: '3:19',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Brain Damage',
            album: slimShadyLP._id,
            trackNumber: 3,
            duration: '3:46',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Role Model',
            album: slimShadyLP._id,
            trackNumber: 4,
            duration: '3:25',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'My Fault',
            album: slimShadyLP._id,
            trackNumber: 5,
            duration: '4:01',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },

        {
            name: 'Kill You',
            album: marshallMathersLP._id,
            trackNumber: 1,
            duration: '4:24',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Stan',
            album: marshallMathersLP._id,
            trackNumber: 2,
            duration: '6:44',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'The Way I Am',
            album: marshallMathersLP._id,
            trackNumber: 3,
            duration: '4:50',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'The Real Slim Shady',
            album: marshallMathersLP._id,
            trackNumber: 4,
            duration: '4:44',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: "I'm Back",
            album: marshallMathersLP._id,
            trackNumber: 5,
            duration: '5:10',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },

        {
            name: 'Bathtub',
            album: doggystyle._id,
            trackNumber: 1,
            duration: '1:50',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'G Funk Intro',
            album: doggystyle._id,
            trackNumber: 2,
            duration: '2:25',
            youtubeUrl:
                'https://www.youtube.com/watch?v=vnPt_WB8A1U&list=RDvnPt_WB8A1U&start_radio=1',
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Gin and Juice',
            album: doggystyle._id,
            trackNumber: 3,
            duration: '3:31',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Who Am I (Whats My Name)?',
            album: doggystyle._id,
            trackNumber: 4,
            duration: '4:06',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'For All My Niggaz & Bitches',
            album: doggystyle._id,
            trackNumber: 5,
            duration: '4:27',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },

        {
            name: 'Hennesey N Buddah',
            album: thaLastMeal._id,
            trackNumber: 1,
            duration: '3:30',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Snoop Dogg',
            album: thaLastMeal._id,
            trackNumber: 2,
            duration: '2:46',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'True Lies',
            album: thaLastMeal._id,
            trackNumber: 3,
            duration: '4:04',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Wrong Idea',
            album: thaLastMeal._id,
            trackNumber: 4,
            duration: '3:52',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },
        {
            name: 'Set It Off',
            album: thaLastMeal._id,
            trackNumber: 5,
            duration: '4:30',
            youtubeUrl: null,
            user: admin._id,
            isPublished: true,
        },

        {
            name: 'Test Track 1',
            album: testAlbum._id,
            trackNumber: 1,
            duration: '3:20',
            youtubeUrl: null,
            user: user._id,
            isPublished: false,
        },
        {
            name: 'Test Track 2',
            album: testAlbum._id,
            trackNumber: 2,
            duration: '4:10',
            youtubeUrl: null,
            user: user._id,
            isPublished: false,
        },
        {
            name: 'Test Track 3',
            album: testAlbum._id,
            trackNumber: 3,
            duration: '3:45',
            youtubeUrl: null,
            user: user._id,
            isPublished: false,
        },
    );
    console.log('Fixtures created successfully');
    await db.close();
};

run().catch(console.error);
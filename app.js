const express = require('express')
const path = require('path')
const { encodeGeoJSONPrediction, encodeGeoJSONAnalytic } = require('./geojson/encoder.js');

// const auth = require('./auth.js');
const app = express()
const port = process.env.PORT || 8080;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/insight', (req, res) => {
    res.sendFile(path.join(__dirname, "insight.html"))
  })
  

app.get('/analytic', (req, res) => {
  res.sendFile(path.join(__dirname, "analytic.html"))
})

app.get('/prediction', (req, res) => {
    res.sendFile(path.join(__dirname, "prediction.html"))
})

app.get('/filtered-geojson', (req, res) => {
    const options = req.query;
    options.selectedZipcodes = options.selectedZipcodes.split(',');
    options.selectedYears = options.selectedYears.split(',');
    const filteredGeoJSON = filterGeoJSON(options);
    res.json(filteredGeoJSON);
});

app.get('/api/encoded-pred', async (req, res) => {
    console.log("PRED")
    const selectedZipcodes = req.query.zipcodes ? req.query.zipcodes.split(',') : [];
    const options = {
        selectedZipcodes: selectedZipcodes,
    };
    try {
        const encodedData = await encodeGeoJSONPrediction(options);
        res.json(encodedData);
        console.log(encodedData.features[0])
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while encoding the data.' });
    }
});

app.get('/api/encoded-anal', async (req, res) => {
    console.log("ANAL")
    const selectedZipcodes = req.query.zipcodes ? req.query.zipcodes.split(',') : [];
    const options = {
        selectedZipcodes: selectedZipcodes,
    };
    try {
        const encodedData = await encodeGeoJSONAnalytic(options);
        res.json(encodedData);
        console.log(encodedData.features[0])
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while encoding the data.' });
    }
});

// app.post('/register', (req, res) => {
//     function success(user) {
//       // start new session with registered user
//       auth.startAuthenticatedSession(req, user, (err = undefined) => {
//         if (err) {
//           console.log(err);
//         }
//         res.redirect('/');
//       });
//     }
//     function error(obj) {
//         res.sendFile(path.join(__dirname, 'register.html'), {message: obj.message});
//     }
//     auth.register(req.body.username, req.body.email, req.body.password, error, success);
// });

// app.post('/login', (req, res) => {
//     function success(user) {
//       // start user session with login credentials
//       startAuthenticatedSession(req, user, (err = undefined) => {
//         if(err) {
//           console.log(err);
//         }
//         res.redirect('/');
//       });
//     }
//     function error(obj) {
//       res.render('login', {message: obj.message});
//     }
//     // use functions in auth.js to check login credentials
//     auth.login(req.body.username, req.body.password, error, success);
//   });

// // User Profile
// app.get('/user', function(req, res) {
//     if (req.session.username === undefined) {
//       res.sendFile(path.join(__dirname, 'index.html'));
//     } else {
//       UserSetting.findOne({ user: req.session.username._id })
//         .populate('settings')
//         .exec((err, userSettings) => {
//           if (err) {
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//           } else {
//             // Extract the setting IDs from the UserSetting object
//             const settingIds = userSettings.settings.map((setting) => setting._id);
//             // Use the setting IDs to fetch the actual settings from the Setting model
//             Setting.find({ _id: { $in: settingIds } }, (err, settings) => {
//               if (err) {
//                 console.log(err);
//                 res.status(500).send('Internal Server Error');
//               } else {
//                 // Pass the settings to your template
//                 res.sendFile(path.join(__dirname, 'user.html'));
//               }
//             });
//           }
//         });
//     }
//   });

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

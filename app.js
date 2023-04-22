const express = require('express')
const path = require('path')
// const auth = require('./auth.js');
const app = express()
const port = process.env.PORT || 8080;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"))
})

app.get('/dashboardpred', (req, res) => {
    res.sendFile(path.join(__dirname, "dashboardpred.html"))
})

app.get('/filtered-geojson', (req, res) => {
    const options = req.query;
    options.selectedZipcodes = options.selectedZipcodes.split(',');
    options.selectedYears = options.selectedYears.split(',');
    const filteredGeoJSON = filterGeoJSON(options);
    res.json(filteredGeoJSON);
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

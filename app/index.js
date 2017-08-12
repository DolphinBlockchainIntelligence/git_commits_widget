const path = require('path');
const request = require('request');
const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const config = require('./config.json');

app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  await loadAll();

  app.get('/:id', (req, res) => res.render('chart', {id: req.params.id}));
  app.get('/:id/json', (req, res) => res.json(config[req.params.id]));

  app.listen(process.env.WEBPORT, () => console.log('Application started'));

  setInterval(register, 60000);

  new CronJob('0 0 2 * * *', loadAll, null, true, 'GMT');
  
})();


function register () {
  request({
    method: 'POST',
    url: process.env.REGURL,
    json: {widgets: config.filter(project => (typeof(project.values) === 'object' && project.values.length > 0))
    .map((project, idx) => { return {title: project.title, url: '/'+idx}; })}
  }, (err, res) => { if (err) console.log(err); });
}

async function loadAll () {
  for (let project of config) {
    if (!project.key) project.key = project.title;
    json = await req(project.git);
    if (typeof(json) !== 'object') {
      project.values = project.values || [];
      return;
    }
    project.values = json.map(week => [week.week * 1000, week.total]);
  }
}

function req (git) {
    console.log('getting', git);
  return new Promise(resolve => {
    request({
      url: 'https://api.github.com/repos/'+ git +'/stats/commit_activity',
      headers: { 'User-Agent': 'request' }
    }, (err, res, body) => {
      if (err) {
         console.log(err);
         return resolve();
      }
      try {
         resolve(JSON.parse(body));
      } catch(err) {
         console.log(err);
         console.log(body);
         resolve();
      }
    });
  });
}

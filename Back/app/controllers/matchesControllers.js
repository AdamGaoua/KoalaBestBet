require('dotenv').config();
const fetch = require('node-fetch');
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer 9_bR2-LLyzrE4sQWOS_XZZNZSOS7gEU_fEPpm2-K5U5CtYR2eXM`
  }
};
const matchController = {
  getMatchsUpcoming: async(req, res) => {
    try {

    let upcoming = [];
   await fetch(`https://api.pandascore.co/csgo/matches/upcoming?sort=&page=1&per_page=100`, options)
    .then(response => {
      return response.json()
    }).then((res) => {
        res.filter((element) => {
          if(element.opponents.length === 2) {
            let dataDate = element.begin_at
            let utcDate = new Date(dataDate);
            let myLocalDate = new Date(Date.UTC(
              utcDate.getFullYear(),
              utcDate.getMonth(),
              utcDate.getDate(),
              utcDate.getHours() + 2,
              utcDate.getMinutes()
            ));
            console.log(element.opponents[0].opponent.name)
           upcoming.push({
            id: element.id,
            matchStarted: myLocalDate.toLocaleString("fr"),
            name: element.name,
            opponents : [{
                "opponent1": {
                  name: element.opponents[0].opponent.name,
                },
                "opponent2": {
                  name: element.opponents[1].opponent.name,
                }
            }]
    
          })
          }
        })  
    })
    return res.status(201).json(upcoming)
}catch(e) {
  console.log(e)
}
}
};

module.exports = matchController;
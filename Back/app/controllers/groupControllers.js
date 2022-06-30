require('dotenv').config();
const groups = require('../dataMappers/group');
const bets = require('../dataMappers/bets');
const fetch = require('node-fetch');
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer 9_bR2-LLyzrE4sQWOS_XZZNZSOS7gEU_fEPpm2-K5U5CtYR2eXM`
  }
};
const onlyLettersNumbersPattern = /^[A-Za-z0-9]+$/;
const groupController = {
  groupCreation: async (req, res) => {
    const userId = parseInt(req.user.userId)
    const {
      name,
      nbJoueurs
    } = req.body;
    const match_id = req.body.matchs_id;
    try {
      if (!name) return res.status(200).json({
        error: 'Entrez un nom d\'équipe'
      })
      if (!name.match(onlyLettersNumbersPattern)) {
        return res.status(200).json({
          error: 'Veuillez entrer un nom d\'équipe valide, Exemple : LesKoalas ! Sans espace et caracteres speciaux !'
        })
      }
      if (!nbJoueurs || isNaN(nbJoueurs)) return res.status(200).json({
        error: 'Veuillez Renseigner/Vérifier le nombre de joueurs'
      })
      if (nbJoueurs > 5) return res.status(200).json({
        error: 'Maximum 5 joueurs !'
      })
      if (nbJoueurs < 2) return res.status(200).json({
        error: 'Minimum 2 joueurs !'
      })
      if (typeof match_id === 'undefined' || match_id.length === 0 || !match_id) return res.status(200).json({
        error: 'Veuillez renseigner les Matchs'
      })
      if (!match_id.every(type => typeof type == 'number')) return res.status(200).json({
        error: 'Veuillez vérifier les matchs renseignés'
      })

      if (match_id.length > 5) return res.status(200).json({
        error: 'Veuillez saisir maximum 5 matchs !'
      })
      const groupId = await groups.getGroupIdByGroupName(name.toLowerCase())
      if (typeof groupId != 'undefined') {
        return res.status(200).json({
          error: 'Veuillez saisir un nom différent, celui-ci est déjà utilisé'
        })
      }
      const invitation_link = require('crypto').randomBytes(32).toString('hex');
      const tryId = await groups.getLeaderFromGroup(userId).then((res) => res).catch((e) => console.error(e));
      if (tryId.length >= 1) return res.status(200).json({
        error: 'Vous avez déjà crée un groupe veuillez le supprimer et en créer un autre !'
      })
      const resp = await groups.createGroup(name, invitation_link, nbJoueurs, userId);
      if (resp) {
        const groupIdv = await groups.getGroupIdByGroupName(name.toLowerCase()).then((res) => res).catch((e) => console.error(e))
        for (a of match_id) {
          await groups.addMatchsToDatabase(a).then((e) => console.log(e)).catch((e) => console.log(e))
        }
        for (a of match_id) {
          await groups.LinkMatchsForOneGroup(groupIdv.id, a).then((e) => console.log(e)).catch((e) => console.log(e))
        }
        console.log(groupIdv.id, userId)
        await groups.linkGroupAndUser(groupIdv.id, userId).catch((e) => console.log(e))
        return res.status(201).json({
          succes: "Group Created",
          invitation_link: `${invitation_link}`
        })

      }
      return res.status(200).json({
        error: "Une erreur est survenue.",
      })
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
    // []
  },
  joinGroup: async (req, res) => {
    try {
      const {
        invitation_link
      } = req.params;
      const userid = req.user.userId;
      if (invitation_link.length >= 65 || invitation_link.length <= 63 || !invitation_link.match(onlyLettersNumbersPattern)) return res.status(200).json({
        error: 'Veuillez vérifier votre lien d\'invitation'
      })
      const verifyInvitation = await groups.verifyValidityOfInvitationLink(invitation_link.toLowerCase()).then((res) => res).catch((e) => console.error(e))
      if (!verifyInvitation || typeof verifyInvitation === 'undefined' || verifyInvitation <= 0) return res.status(200).json({
        error: 'Veuillez vérifier votre lien d\'invitation'
      })
      let verifuser;
      verifyInvitation.forEach((element) => verifuser = element.id)
      const verifyIfUserAllreadyOnGroup = await groups.getInfosFromGroup(verifuser)
      let compareResult;
      verifyIfUserAllreadyOnGroup.filter((element) => element.id === req.user.userId).forEach((element) => compareResult = element)
      if (verifyIfUserAllreadyOnGroup.length >= verifyInvitation[0].players_number) return res.status(200).json({
        error: 'Capacité Max du groupe atteinte !'
      })
      if (!compareResult) {
        await groups.linkGroupAndUser(verifuser, userid).then((res) => res).catch((e) => console.error(e))
        return res.status(201).json({
          succes: `Vous avez rejoins le groupe aves succès !`
        })
      }
      return res.status(200).json({
        error: 'Vous avez déjà rejoins ce groupe !'
      })
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  getAllInfosOfAfGroup: async (req, res) => {
    try {
      const group_id = parseInt(req.params.group_id);
      const userid = parseInt(req.user.userId);
      if (isNaN(group_id) || isNaN(userid)) return res.status(200).json({
        error: 'Veuillez vérifier l\'ID spécifié'
      })
      const infosGroup = await groups.getInfosFromGroup(group_id)
      let compareResult;
      infosGroup.filter((element) => element.user_id === req.user.userId).forEach((element) => compareResult = element)
      if (compareResult) return res.status(201).json(infosGroup)
      return res.status(200).json({
        error: 'Vous n\'avez pas accès aux infos de ce groupe'
      })
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  getGroupByUserId: async (req, res) => {
    try {
      const user_id = parseInt(req.params.user_id);
      const userid = parseInt(req.user.userId);
      if (isNaN(user_id) || isNaN(userid)) return res.status(200).json({
        error: 'Veuillez vérifier l\'ID spécifié'
      })
      if (userid === user_id) {
        const infosGroup = await groups.getGroupsOfUser(user_id)
        return res.status(201).json(infosGroup)
      }
      return res.status(200).json({
        error: 'Vous n\'avez pas accès aux infos de cette user'
      })
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  deleteGroup: async (req, res) => {
    try {
      const group_id = parseInt(req.params.group_id);
      const userid = parseInt(req.user.userId);
      if (isNaN(group_id) || isNaN(userid)) return res.status(200).json({
        error: 'Veuillez vérifier l\'ID spécifié'
      })
      const infosGroup = await groups.getInfosFromGroup(group_id)
      console.log(infosGroup)
      let compareResult;
      infosGroup.filter((element) => element.user_id === userid).forEach((element) => compareResult = element)
      if (compareResult) {
        let checkIfLead;
        infosGroup.filter((element) => element.group_leader_id === userid).forEach((element) => checkIfLead = element);
        console.log(checkIfLead)
        if (checkIfLead) {
          await groups.deleteGroup(group_id)
          console.log(userid)
          return res.status(201).json({
            success: `Vous avez réussi à supprimer le groupe`
          })
        } else {
          await groups.leaveGroup(userid, group_id)
          return res.status(201).json({
            success: `Vous avez quitté le groupe : ${group_id}!`
          })
        }
      }
      return res.status(200).json({
        error: 'Impossible de supprimer ou quitter le groupe !'
      })
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  rankingOfGroup: async (req, res) => {
    const group_id = parseInt(req.params.group_id)
    const userId = parseInt(req.user.userId)
    try {
      if (!group_id) return res.status(200).json({
        error: 'Veuillez renseigner l\'ID du groupe'
      })
      //
      const betUser = await bets.getBetsByGroupAndUser(group_id, userId)
      if (betUser.length <= 0) return res.status(200).json({
        error: 'Vous n\'avez pas encore parié dans ce groupe!'
      })
      const groupInfos = await groups.getInfosFromGroup(group_id).then((res) => res).catch((e) => console.error(e))
      if (typeof groupInfos[0] === 'undefined') return res.status(200).json({
        error: 'Veuillez vérifier l\'ID du groupe renseigné'
      })
      const verifyUser = groupInfos.find(element => element.id === userId)
      if (!verifyUser) return res.status(200).json({
        error: 'Vous n\'avez pas accès aux infos de ce groupe !'
      })
      let getResults = await groups.getMatchOfGroup(group_id, userId);
      let getRanking = await groups.getRankOfGroup(group_id, userId);
      if (getResults.length > 0) {
        let tryyy = [];
        let betFromUser = [];
        let matchesComing = [];
        let liveMatches = [];
        let matchFinished = [];
        let betFromUserA = [];
        for (a of betUser) {
          tryyy.push(a.match_pandascore)
        }
        const matchsid = tryyy.reverse().join(',')
        await fetch(`https://api.pandascore.co/csgo/matches?filter[id]=${matchsid}&sort=&page=1&per_page=100`, options)
          .then(response => {
            return response.json()
          })
          .then(response => {
            betFromUser.push(response)
          })
          .catch(err => console.error(err));
          for (a of betUser) {
            console.log(betUser)
            for (b of betFromUser[0]) {
              b.opponents.find((element) => {
                if (element.opponent.id === a.bet) {
                  betFromUserA.push({
                    id: a.bet,
                    name: b.name,
                    winner_bet: element.opponent.name
                  })
                }
               })
              
            }
          }
          for (b of betFromUser) {
          b.find((element) => {
            if (element.status === 'finished') {
              console.log(element.status)
              matchFinished.push({
                id: element.id,
                team1_name: element.opponents[0].opponent.name,
                team1_logo: element.opponents[0].opponent.image_url,
                team1_score: element.results[0].score,
                team2_name: element.opponents[1].opponent.name,
                team2_logo: element.opponents[1].opponent.image_url,
                team2_score: element.results[1].score
              })
            }
            if (element.status === 'running') {
              console.log(element.status)
              liveMatches.push({
                id: element.id,
                team1_name: element.opponents[0].opponent.name,
                team1_logo: element.opponents[0].opponent.image_url,
                team1_score: element.results[0].score,
                team2_name: element.opponents[1].opponent.name,
                team2_logo: element.opponents[1].opponent.image_url,
                team2_score: element.results[1].score
              })
            }
            if (element.status === 'not_started') {
              let dataDate = element.begin_at
              let utcDate = new Date(dataDate);
              let myLocalDate = new Date(Date.UTC(
                utcDate.getFullYear(),
                utcDate.getMonth(),
                utcDate.getDate(),
                utcDate.getHours() + 2,
                utcDate.getMinutes()
              ));
              matchesComing.push({
                id: element.id,
                match_begin_at: myLocalDate.toLocaleString("fr"),
                live_twitch: element.live_embed_url,
                team1_name: element.opponents[0].opponent.name,
                team1_logo: element.opponents[0].opponent.image_url,
                team2_name: element.opponents[1].opponent.name,
                team2_logo: element.opponents[1].opponent.image_url
              })
            }
          })
          
        }
        objBack = {
          playerRank: getRanking,
          betFromUser: betFromUserA,
          matchLive: liveMatches,
          matchIncoming: matchesComing,
          matchFinished: matchFinished
        }
        return res.status(201).json(objBack)
      }
      return res.status(200).json({
        error: 'Aucun paris détecté dans ce groupe'
      })

    } catch (e) {
      console.log(e)
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
      
    }
    // []
  },
  getMatchsInfosByGroupId: async (req, res) => {
    const userId = parseInt(req.user.userId)
    const group_id = parseInt(req.params.group_id)
    try {
      if (!group_id) return res.status(200).json({
        error: 'Veuillez renseigner l\'ID du groupe'
      })
      //
      const groupInfos = await groups.getInfosFromGroup(group_id).then((res) => res).catch((e) => console.error(e))
      if (typeof groupInfos[0] === 'undefined') return res.status(200).json({
        error: 'Veuillez vérifier l\'ID du groupe renseigné'
      })
      const verifyUser = groupInfos.filter(element => element.id === userId)
      if (!verifyUser.length) return res.status(200).json({
        error: 'Vous n\'avez pas accès aux infos de ce groupe !'
      })
      const matches = await groups.getMatchOfGroup(group_id, userId);
      console.log(matches)
      let tryyy = [] ;
      let infosOfMatch = [];
      let infosOfMatchFiltered = [];
      if (matches.length <= 0) return res.status(200).json({
        error: 'Aucun match dans le groupe'
      })
      for (a of matches) {
        tryyy.push(a.match_pandascore)
      }
      const matchsid = tryyy.reverse().join(',')
      await fetch(`https://api.pandascore.co/csgo/matches?filter[id]=${matchsid}&sort=&page=1&per_page=100`, options)
        .then(response => {
          return response.json()
        })
        .then(response => {
          for(a of response) {
          infosOfMatch.push({
          match_begin_at: a.begin_at,
          match_id: a.id,
          status: a.status,
          live_twitch: a.live_embed_url,
          match_name: a.name,
          number_of_games: a.number_of_games, 
          team1_id: a.opponents[0].opponent.id,
          team1_name: a.opponents[0].opponent.name,
          team1_logo: a.opponents[0].opponent.image_url,
          team2_id: a.opponents[1].opponent.id,
          team2_name: a.opponents[1].opponent.name,
          team2_logo: a.opponents[1].opponent.image_url
          })
        }})
        .catch(err => console.error(err));

        console.log(infosOfMatch)
          infosOfMatch.filter((element) => {
          if(element.status === "not_started") {
          const date = new Date(element.match_begin_at).toLocaleString("fr")
          infosOfMatchFiltered.push({
          match_begin_at: date,
          match_id : element.match_id,
          live_twitch: element.live_twitch,
          match_name: element.match_name,
          number_of_games: element.number_of_games,
          team1_id: element.team1_id,
          team1_name: element.team1_name,
          team1_logo: element.team1_logo,
          team2_id: element.team2_id,
          team2_name: element.team2_name,
          team2_logo: element.team2_logo,
        })
          }
        })
        if(infosOfMatchFiltered.length !== matches.length) return res.status(200).json({error : 'Les Joueurs n\'ont pas tous rejoins le groupe à temps ou les matchs ont commencé sans que tous les joueurs n\'aient pariés, veuillez refaire un nouveau groupe'})
      return res.status(201).json(infosOfMatchFiltered)
    } catch (e) {
      console.log(e)
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
};

module.exports = groupController;
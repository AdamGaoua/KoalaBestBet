require('dotenv').config();
const groups = require('../dataMappers/group')
const bets = require('../dataMappers/bets');
const fetch = require('node-fetch');
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer 9_bR2-LLyzrE4sQWOS_XZZNZSOS7gEU_fEPpm2-K5U5CtYR2eXM`
  }
};
async function updatewinningBet(id) {
  await bets.updateBetStatusWinner(id).then((e) => console.log(e)).catch((e) => {
    return res.status(200).json({
      error: 'Un Problème est survenu.'
    })
  })
}
async function updatelosingBet(id) {
  await bets.updateBetStatusLoser(id).then((e) => e).catch((e) => {
    return res.status(200).json({
      error: 'Un Problème est survenu.'
    })
  })
}
const betController = {
  submitBet: async (req, res) => {
    const userId = parseInt(req.user.userId)
    const group_id = parseInt(req.params.group_id)
    console.log(req.body.bets)
    try {
      if (!group_id) return res.status(200).json({
        error: 'Veuillez renseigner l\'ID du groupe'
      })
      if (typeof req.body.bets === 'undefined' || !req.body.bets.length || !req.body.bets) return res.status(200).json({
        error: 'Veuillez renseigner les Matchs'
      })
      if (!req.body.bets.every(type => typeof type == 'number')) return res.status(200).json({
        error: 'Veuillez vérifier les pronostics renseignés'
      })
      const groupInfos = await groups.getInfosFromGroup(group_id).then((res) => res).catch((e) => console.error(e))
      if (typeof groupInfos[0] === 'undefined') return res.status(200).json({
        error: 'Veuillez vérifier l\'ID du groupe renseigné'
      })
      const verifyUser = groupInfos.filter(element => element.id === userId)
      if (!verifyUser.length) return res.status(200).json({
        error: 'Vous ne pouvez pas parier dans ce groupe !'
      })
      const verifyLenghtOfBet = await groups.getMatchOfGroup(group_id, userId).then((res) => res).catch((e) => console.error(e))
      if (verifyLenghtOfBet.length != req.body.bets.length) return res.status(200).json({
        error: 'Vérifiez votre nombre de paris !'
      })
      const verifyIfAllreadyBet = await bets.getBetsByGroupAndUser(group_id, userId)
      if (!verifyIfAllreadyBet[0]) {
        req.body.bets.forEach((bet, index) => {
          const match = verifyLenghtOfBet[index].id;
          bets.createBet(bet, userId, group_id, match)
        });
        await bets.updateParticipe(userId, group_id)
        return res.status(201).json({
          success: 'Vos pronostics ont été enregistré !'
        })
      }

      return res.status(200).json({
        error: 'Vous avez déja parié dans ce groupe !'
      })
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  getBetByUserIdAndGroupId: async (req, res) => {
    const userId = parseInt(req.user.userId)
    const group_id = parseInt(req.params.group_id)
    console.log(req.body.bets)
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
      const getBets = await bets.getBetsByGroupAndUser(group_id, userId)
      if (getBets.length > 0) return res.status(201).json(getBets)
      return res.status(200).json({
        error: 'Aucun paris détecté de la pars du joueur'
      })

    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
    // []
  },
  verifyBetByGroup: async (req, res) => {
    const group_id = parseInt(req.params.group_id)
    const userId = parseInt(req.user.userId)
    try {
      if (!group_id) return res.status(200).json({
        error: 'Veuillez renseigner l\'ID du groupe'
      })
      //
      const groupInfos = await groups.getInfosFromGroup(group_id).then((res) => res).catch((e) => console.error(e))
      if (typeof groupInfos[0] === 'undefined') return res.status(200).json({
        error: 'Veuillez vérifier l\'ID du groupe renseigné'
      })
      const verifyUser = groupInfos.find(element => element.id === userId)
      if (!verifyUser) return res.status(200).json({
        error: 'Vous n\'avez pas accès aux infos de ce groupe !'
      })
      const betUser = await bets.getBetsByGroupAndUser(group_id, userId)
      let infosOfMatch = [];
      let matches = [] ;
      for (a of betUser) {
        matches.push(a.match_pandascore)
      }
      const matchsid = matches.reverse().join(',')
      await fetch(`https://api.pandascore.co/csgo/matches?filter[id]=${matchsid}&sort=&page=1&per_page=100`, options)
        .then(response => {
          return response.json()
        })
        .then(response => {
          infosOfMatch.push(response)
        })
        .catch(err => console.error(err));
      if (infosOfMatch.length > 0) {
        infosOfMatch[0].forEach(element => {
          betUser.filter(el => {
            if (el.status !== 'finished' && el.bet === element.winner_id && element.status === 'finished') {
              updatewinningBet(el.id).then(e => console.log(e)).catch(er => console.log(er))
            }
            if (el.status !== 'finished' && el.bet !== element.winner_id && element.status === 'finished') {
              updatelosingBet(el.id).catch((e) => console.log(e))
            }
          })
        })
        return res.status(201).json({
          success: 'Paris vérifié'
        })
      }
      return res.status(200).json({
        error: 'Aucun paris à vérifier'
      })
    } catch (e) {
      console.log(e)
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  updatePointsByGroup: async (req, res) => {
    const group_id = parseInt(req.params.group_id)
    const userId = parseInt(req.user.userId)

    try {
      if (!group_id) return res.status(200).json({
        error: 'Veuillez renseigner l\'ID du groupe'
      })
      //
      const groupInfos = await groups.getInfosFromGroup(group_id).then((res) => res).catch((e) => console.error(e))
      if (typeof groupInfos[0] === 'undefined') return res.status(200).json({
        error: 'Veuillez vérifier l\'ID du groupe renseigné'
      })
      const verifyUser = groupInfos.find(element => element.user_id === userId)
      console.log(verifyUser)
      if (!verifyUser) return res.status(200).json({
        error: 'Vous n\'avez pas accès aux infos de ce groupe !'
      })
      const getResults = await groups.getRankOfGroup(group_id).then((res) => res).catch((e) => console.error(e))
      const verifyIfAllUserBet = await groups.getAllInfosFromGroupByUserId(group_id, userId).then((res) => res).catch((e) => console.error(e))
      if (getResults.length !== verifyIfAllUserBet[0].nb_participants_max) return res.status(200).json({
        error: 'Tous les joueurs n\'ont pas encore parié !'
      })
      if (getResults.length > 0) {
        const betUser = await bets.getBetsByGroupAndUser(group_id, userId)
        if (betUser.every(el => el.status === 'pointsdistributed')) return res.status(200).json({
          error: 'Tous les points ont déjà été distribués !'
        }) 
        else if (betUser.every(el => el.status === 'finished')) {
          
          if (getResults.length === 2) {
            let participantMultiple = getResults.length * 10
            let matchMultiple = 10 * betUser.length
            let KoalaPrize = participantMultiple + matchMultiple;
            if (getResults[0].winning_bet === '0' && getResults[1].winning_bet === '0') {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              console.log(betUser2)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              return res.status(201).json({
                success: 'Aucun Vainqueur, aucun KC distribué'
              })
            }
            if (getResults[0].winning_bet === getResults[1].winning_bet) {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              console.log(betUser1, betUser2)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              await bets.addPointsToUser(getResults[0].id, KoalaPrize / 2)
              await bets.addPointsToUser(getResults[1].id, KoalaPrize / 2)
              return res.status(201).json({
                success: `Égalite ${KoalaPrize} partagé entre les deux participants`
              })
            }
            if (getResults[0].winning_bet > getResults[1].winning_bet) {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              console.log(betUser1, betUser2)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              await bets.addPointsToUser(getResults[0].id, KoalaPrize)
              return res.status(201).json({
                success: `Bravo ! ${KoalaPrize} distribué à ${getResults[0].id}`
              })
            }
            if (getResults[0].winning_bet < getResults[1].winning_bet) {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              for (a of betUser1) {
              await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
              await bets.updateBetAfterGivenPoints(b.id)
              }
              await bets.addPointsToUser(getResults[1].id, KoalaPrize)
              return res.status(201).json({
                success: `Bravo ! ${KoalaPrize} distribué à ${getResults[1].id}`
              })
            }
          }
          if (getResults.length === 3) {
            console.log('je suis la')
            let participantMultiple = getResults.length * 10
            let matchMultiple = 10 * betUser.length
            let KoalaPrize = participantMultiple + matchMultiple;
            if (getResults[0].winning_bet === '0' && getResults[1].winning_bet === '0' && getResults[2].winning_bet === '0') {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              return res.status(200).json({
                success: 'Aucun Vainqueur, aucun KC distribué'
              })
            }
            if (getResults[0].winning_bet === getResults[1].winning_bet && getResults[1].winning_bet === getResults[2].winning_bet) {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              await bets.addPointsToUser(getResults[0].id, KoalaPrize / getResults.length) //Match.ceil()
              await bets.addPointsToUser(getResults[1].id, KoalaPrize / getResults.length)
              await bets.addPointsToUser(getResults[2].id, KoalaPrize / getResults.length)
              return res.status(201).json({
                success: `Égalite ${KoalaPrize} partagé entre les 3 participants`
              })
            } else {
              let KoalaPrize1 = 80 * KoalaPrize / 100
              let KoalaPrize2 = 20 * KoalaPrize / 100
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              await bets.addPointsToUser(getResults[0].id, Math.ceil(KoalaPrize1))
              await bets.addPointsToUser(getResults[1].id, Math.ceil(KoalaPrize2))
              return res.status(201).json({
                success: `Bravo ! ${KoalaPrize1} KoalaCoins distribué à ${getResults[0].id} et ${KoalaPrize2} KoalaCoins ${getResults[1].id}`
              })
            }
          }
          if (getResults.length === 4) {
            let participantMultiple = getResults.length * 10
            let matchMultiple = 10 * betUser.length
            let KoalaPrize = participantMultiple + matchMultiple;
            if (getResults[0].winning_bet === '0' && getResults[1].winning_bet === '0' && getResults[2].winning_bet === '0' && getResults[3].winning_bet === '0') {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              const betUser4 = await bets.getBetsByGroupAndUser(group_id, getResults[3].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              for (d of betUser4) {
                await bets.updateBetAfterGivenPoints(d.id)
              }
              return res.status(201).json({
                success: 'Aucun Vainqueur, aucun KC distribué'
              })
            }
            if (getResults[0].winning_bet === getResults[1].winning_bet && getResults[1].winning_bet === getResults[2].winning_bet && getResults[2].winning_bet === getResults[3].winning_bet) {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              const betUser4 = await bets.getBetsByGroupAndUser(group_id, getResults[3].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              for (d of betUser4) {
                await bets.updateBetAfterGivenPoints(d.id)
              }
              const KoalaPrizeEqual = Math.ceil(KoalaPrize / getResults.length)
              await bets.addPointsToUser(getResults[0].id, KoalaPrizeEqual)
              await bets.addPointsToUser(getResults[1].id, KoalaPrizeEqual)
              await bets.addPointsToUser(getResults[2].id, KoalaPrizeEqual)
              await bets.addPointsToUser(getResults[3].id, KoalaPrizeEqual)
              return res.status(201).json({
                success: `Égalite ${KoalaPrize} partagé entre les 3 participants`
              })
            } else {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              const betUser4 = await bets.getBetsByGroupAndUser(group_id, getResults[3].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              for (d of betUser4) {
                await bets.updateBetAfterGivenPoints(d.id)
              }
              let KoalaPrize1 = 80 * 100 / KoalaPrize
              let KoalaPrize2 = 15 * 100 / KoalaPrize
              let KoalaPrize3 = 5 * 100 / KoalaPrize
              await bets.addPointsToUser(getResults[0].id, Math.ceil(KoalaPrize1))
              await bets.addPointsToUser(getResults[1].id, Math.ceil(KoalaPrize2))
              await bets.addPointsToUser(getResults[2].id, Math.ceil(KoalaPrize3))
              return res.status(201).json({
                success: `Bravo ! ${KoalaPrize1} KoalaCoins distribué à ${getResults[0].id} , ${KoalaPrize2} KoalaCoins distribué à ${getResults[1].id} et ${KoalaPrize3} KoalaCoins distribué à ${getResults[2].id}`
              })
            }
          }
          if (getResults.length === 5) {
            let participantMultiple = getResults.length * 10
            let matchMultiple = 10 * betUser.length
            let KoalaPrize = participantMultiple + matchMultiple;
            if (getResults[0].winning_bet === '0' && getResults[1].winning_bet === '0' && getResults[2].winning_bet === '0' && getResults[3].winning_bet === '0' && getResults[3].winning_bet === '0' && getResults[4].winning_bet === '0') {
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              const betUser4 = await bets.getBetsByGroupAndUser(group_id, getResults[3].id)
              const betUser5 = await bets.getBetsByGroupAndUser(group_id, getResults[4].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              for (d of betUser4) {
                await bets.updateBetAfterGivenPoints(d.id)
              }
              for (e of betUser5) {
                await bets.updateBetAfterGivenPoints(e.id)
              }
              return res.status(201).json({
                success: 'Aucun Vainqueur, aucun KC distribué'
              })
            }
            if (getResults[0].winning_bet === getResults[1].winning_bet && getResults[1].winning_bet === getResults[2].winning_bet && getResults[2].winning_bet === getResults[3].winning_bet && getResults[3].winning_bet === getResults[4].winning_bet) {
              const KoalaPrizeEqual = Math.ceil(KoalaPrize / getResults.length)
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              const betUser4 = await bets.getBetsByGroupAndUser(group_id, getResults[3].id)
              const betUser5 = await bets.getBetsByGroupAndUser(group_id, getResults[4].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              for (d of betUser4) {
                await bets.updateBetAfterGivenPoints(d.id)
              }
              for (e of betUser5) {
                await bets.updateBetAfterGivenPoints(e.id)
              }
              await bets.addPointsToUser(getResults[0].id, KoalaPrizeEqual)
              await bets.addPointsToUser(getResults[1].id, KoalaPrizeEqual)
              await bets.addPointsToUser(getResults[2].id, KoalaPrizeEqual)
              await bets.addPointsToUser(getResults[3].id, KoalaPrizeEqual)
              return res.status(201).json({
                success: `Égalite ${KoalaPrize} partagé entre les 5 participants`
              })
            } else {
              let KoalaPrize1 = 70 * KoalaPrize / 100
              let KoalaPrize2 = 15 * KoalaPrize / 100
              let KoalaPrize3 = 10 * KoalaPrize / 100
              let KoalaPrize4 = 5 * KoalaPrize / 100
              const betUser1 = await bets.getBetsByGroupAndUser(group_id, getResults[0].id)
              const betUser2 = await bets.getBetsByGroupAndUser(group_id, getResults[1].id)
              const betUser3 = await bets.getBetsByGroupAndUser(group_id, getResults[2].id)
              const betUser4 = await bets.getBetsByGroupAndUser(group_id, getResults[3].id)
              const betUser5 = await bets.getBetsByGroupAndUser(group_id, getResults[4].id)
              for (a of betUser1) {
                await bets.updateBetAfterGivenPoints(a.id)
              }
              for (b of betUser2) {
                await bets.updateBetAfterGivenPoints(b.id)
              }
              for (c of betUser3) {
                await bets.updateBetAfterGivenPoints(c.id)
              }
              for (d of betUser4) {
                await bets.updateBetAfterGivenPoints(d.id)
              }
              for (e of betUser5) {
                await bets.updateBetAfterGivenPoints(e.id)
              }
              await bets.addPointsToUser(getResults[0].id, Math.ceil(KoalaPrize1))
              await bets.addPointsToUser(getResults[1].id, Math.ceil(KoalaPrize2))
              await bets.addPointsToUser(getResults[2].id, Math.ceil(KoalaPrize3))
              await bets.addPointsToUser(getResults[3].id, Math.ceil(KoalaPrize4))
              return res.status(201).json({
                success: `Bravo ! ${KoalaPrize1} KoalaCoins distribué à ${getResults[0].id} , ${KoalaPrize2} KoalaCoins distribué à ${getResults[1].id} , ${KoalaPrize3} KoalaCoins distribué à ${getResults[2].id} et ${KoalaPrize4} KoalaCoins distribué à ${getResults[3].id}`
              })
            }
          }
        } else {
          return res.status(200).json({
            error: 'Paris toujours en cours'
          })
        }
      }
      if (getResults.length <= 0) return res.status(200).json({
        error: 'Aucun paris détecté dans ce groupe'
      })
      return  res.status(200).json({
        error: 'Paris toujours en cours'
      })
    } catch (e) {
      console.log(e)
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
    // []
  }
};

module.exports = betController;
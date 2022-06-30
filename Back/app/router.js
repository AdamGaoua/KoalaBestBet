const express = require('express');
const router = express.Router();
const userController = require('./controllers/usersController');
const groupController = require('./controllers/groupControllers')
const betController = require('./controllers/betControllers')
const matchController = require('./controllers/matchesControllers')
const userConnectedVerif = require('./utils/jwt.verify');



router.get('/', (_, res) => {
    res.send('Ping')
})
router.put('/signup-action', userController.signupAction) // Inscription
router.post('/login-action', userController.loginAction) // Connexion + JWT 
router.get('/list/rank/limited', userController.getRankLimited); // Lister le classement général des 10 premiers pour l'accueil
router.put('/create-group', userConnectedVerif, groupController.groupCreation) //Créer un croupe
router.get('/infos/user/:id', userConnectedVerif, userController.findUserById) // Avoir Info de Un User
router.patch('/infos/user/:id', userConnectedVerif, userController.updateInfosByUserId) // Modifier Infos utilisateur, username, email...
router.get('/invite/:invitation_link', userConnectedVerif, groupController.joinGroup) // Rejoindre un groupe grace à une invitation
router.delete('/delete-group/group/:group_id', userConnectedVerif, groupController.deleteGroup) // Supprimer/Quitter un groupe
router.delete('/delete-account/:user_id', userConnectedVerif, userController.deleteUser) // Supprimer son compte
router.get('/list/groups/:group_id', userConnectedVerif, groupController.getAllInfosOfAfGroup) // Lister les membres d'un groupe
router.get('/list/rank/group/:group_id', userConnectedVerif, groupController.rankingOfGroup) // Lister le classement d'un groupe
router.get('/list/groups/user/:user_id', userConnectedVerif, groupController.getGroupByUserId) // Lister les groupes d'un utilisateur + statut hasBet
router.get('/update-points/group/:group_id', userConnectedVerif, betController.updatePointsByGroup) // Distribution des KoalaCoins
router.get('/list/matchs/group/:group_id', userConnectedVerif, groupController.getMatchsInfosByGroupId) // Lister infos des matchs par group_id
router.get('/list/matchs/upcoming', userConnectedVerif, matchController.getMatchsUpcoming) // Lister infos des matchs par group_id
router.get('/list/bets/group/user/:group_id', userConnectedVerif, betController.getBetByUserIdAndGroupId) // Lister les pronostics d'un user par rapport a son group_id
router.get('/list/rank', userConnectedVerif, userController.getRank) // Lister le classement général du site
router.patch('/verify-bet/group/:group_id', userConnectedVerif, betController.verifyBetByGroup) // Vérifier les bets d'un groupe
router.put('/create-bet/group/:group_id', userConnectedVerif, betController.submitBet) // Créer son pronostic par rapport à un groupe
module.exports = router;


const emailValidator = require('email-validator');
var jwtUtils = require('../utils/jwt');
const bcrypt = require('bcrypt');
const users = require('../dataMappers/users');
const onlyLettersNumbersPattern = /^[A-Za-z0-9]+$/;
const LettersAndSpace = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
const Space = /\x20/g;
const userController = {
  signupAction: async (req, res) => {
    const {
      email,
      username,
      password,
      firstname,
      passwordconfirm,
      lastname
    } = req.body;
    if (!email) return res.status(200).json({
      error: 'Veuillez renseigner un mail'
    })
    if (!username) return res.status(200).json({
      error: 'Veuillez renseigner un pseudo'
    })
    if (!password) return res.status(200).json({
      error: 'Veuillez renseigner un mot de passe'
    })
    if (!firstname) return res.status(200).json({
      error: 'Veuillez renseigner un prénom'
    })
    if (!lastname) return res.status(200).json({
      error: 'Veuillez renseigner un Nom de famille'
    })
    if (!firstname.match(LettersAndSpace)) return res.status(200).json({
      error: 'Veuillez vérifier le prénom saisis.'
    })
    if (!lastname.match(LettersAndSpace)) return res.status(200).json({
      error: 'Veuillez vérifier le Nom de famille saisis.'
    })
    const emailtofind = email.toLowerCase();
    try {
      if (!emailValidator.validate(emailtofind)) return res.status(200).json({
        error: 'Vérifiez le mail saisis'
      });
      if (!username.match(onlyLettersNumbersPattern)) return res.status(200).json({
        error: 'Vérifiez le pseudo saisis.'
      })
      if (password.match(Space)) return res.status(200).json({
        error: 'Veuillez vérifier votre mot de passe'
      })
      if (username.length > 20) return res.status(200).json({
        error: 'Veuillez Saisir un pseudo de moins de 20 Caractères'
      })

      const user = await users.findByEmail(emailtofind.toLowerCase())
      if (user.length > 0) return res.status(200).json('L\'email à déjà été utilisé');
      if (user.length === 0) {
        const userName = await users.findByUsername(username.toLowerCase());
        console.log(userName.length)
        if (userName.length != 0) return res.status(200).json('Ce pseudo à déjà été utilisé');

        if (userName.length === 0) {
          if (password === passwordconfirm) {
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            const avatar_id = Math.floor(Math.random() * (25 - 1) + 1)
            const forLink = await users.createUser(username, firstname, lastname, email, encryptedPassword, avatar_id).catch((e) => console.log(e))
            await users.linkUserAndAvatar(parseInt(forLink[0].id), avatar_id)
            return res.status(201).json({
              success: `Compte crée avec succès.`
            });
          } else {
            return res.status(200).json({error : 'Vérifiez vos mot de passe'})
          }
        }
      }
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }

  },
  loginAction: async (req, res) => {
    const {
      email,
      password
    } = req.body;
    if (!email) return res.status(200).json({
      error: 'Vérifiez votre mail'
    })
    if (!password) return res.status(200).json({
      error: 'Vérifiez votre mot de passe'
    })
    if (!emailValidator.validate(email)) {
      return res.status(200).json({
        error: 'Vérifiez votre mail'
      });
    } else {

      try {
        const emailtofind = await users.findByEmail(email.toLowerCase());
        console.log(emailtofind)
        if (emailtofind.length != 0) {
          const verifyPassword = await bcrypt.compare(password, emailtofind[0].password).then((res) => res).catch((e) => console.error(e))
          console.log(verifyPassword)
          if (verifyPassword) {
            return res.status(201).json({
              'userId': emailtofind[0].id,
              'token': jwtUtils.generateTokenForUser(emailtofind[0])
            });
          } else {
            return res.status(200).json({
              error: 'Verifiez vos informations de connexion.'
            });
          }
        }
        return res.status(200).json({
          error: 'Vérifiez votre mail et mot passe'
        })
      } catch (e) {
        console.log(e)
        return res.status(200).json({
          error: 'Un Problème est survenu.'
        })
      }


    }
  },
  findUserById: async (req, res) => {
    const {
      id
    } = req.params;
    console.log(id, req.user.userId)
    console.log(req.headers)
    try {
      if (!id || isNaN(id)) return res.status(200).json({
        error: 'Veuillez vérifier l\' ID fournis.'
      })
      if (req.user.userId == id) {

        const usertofind = await users.findByIdUser(id).then((res) => res).catch((e) => console.error(e));
        if (usertofind.length != 0) {
          const usertofindJson = JSON.stringify(usertofind);
          return res.status(201).send(usertofindJson);

        }
        return res.status(200).json({
          error: 'Veuillez vérifier l\' ID fournis.'
        });
      }
      return res.status(200).json({
        error: 'Veuillez vérifier l\' ID fournis.'
      });
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  updateInfosByUserId: async (req, res) => {
    const {
      id
    } = req.params;
    const {
      username,
      firstname,
      lastname,
      email,
      password,
      newPassword,
      confirmNewPassword
    } = req.body;
    const userN = username.toLowerCase();
    const emailE = email.toLowerCase();
    const firstN = firstname.toLowerCase();
    const lastN = lastname.toLowerCase();
    try {
      if (!id || isNaN(id)) return res.status(200).json({
        error: 'Veuillez vérifier l\' ID fournis.'
      })
      if (req.user.userId == id) {
        if (email && username && firstname && lastname && password) {
          if (lastname.length > 40) return res.status(200).json({
            error: 'Veuillez Saisir un Nom de Famille de moins de 40 Caractères'
          })
          if (firstname.length > 20) return res.status(200).json({
            error: 'Veuillez Saisir un Prénom de moins de 20 Caractères'
          })
          if (!username.match(onlyLettersNumbersPattern)) return res.status(200).json({
            error: 'Veuillez vérifier le nom d\'utilisateur saisis.'
          })
          if (!emailValidator.validate(email)) return res.status(200).json({
            error: 'Veuillez saisir un mail valide.'
          });
          if (username.length > 20) return res.status(200).json({
            error: 'Veuillez Saisir un pseudo de moins de 20 Caractères'
          })
          const usertofind = await users.findAllInfosOfUser(id)
          const userDB = usertofind[0].username.toLowerCase();
          const emailDB = usertofind[0].email.toLowerCase();
          const firstnameDB = usertofind[0].firstname.toLowerCase();
          const lastnameDB = usertofind[0].lastname.toLowerCase();
          if (!firstname.match(LettersAndSpace)) return res.status(200).json({
            error: 'Veuillez vérifier le prénom saisis.'
          })
          if (!lastname.match(LettersAndSpace)) return res.status(200).json({
            error: 'Veuillez vérifier le Nom de famille saisis.'
          })
          if (usertofind.length != 0) {
            const verifyPassword = await bcrypt.compare(password, usertofind[0].password).then((res) => res).catch((e) => console.error(e))
            if (!verifyPassword) return res.status(200).json({
              error: 'Veuillez vérifier votre mot de passe.'
            })
            if (verifyPassword) {
              if (userN === userDB && emailE === emailDB && firstnameDB === firstN && lastnameDB === lastN) return res.status(200).json({
                error: 'Aucun changement détecté'
              });
              if (userN !== userDB && emailE !== emailDB) {
                const user = await users.findByEmail(emailE)
                if (user.length > 0) return res.status(200).json({
                  error: 'L\'email à déjà été utilisé'
                });
                const userName = await users.findByUsername(userN);
                if (userName.length != 0) return res.status(200).json({
                  error: 'Ce pseudo à déjà été utilisé'
                });
                let newArray = [];
                newArray.push({
                  email: req.body.email,
                  username: req.body.username,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname
                })
                await users.updateUser(id, newArray[0]).catch((e) => {
                  return res.status(200).json({
                    error: 'Un Problème est survenu.'
                  })
                })
                return res.status(201).json({
                  success: 'Informations Utilisateur mise à jour.'
                })
              }
              if (userN !== userDB) {
                const userName = await users.findByUsername(userN);
                if (userName.length != 0) return res.status(200).json({
                  error: 'Ce pseudo à déjà été utilisé'
                });
                let newArray = [];
                newArray.push({
                  username: req.body.username,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname
                })
                await users.updateUser(id, newArray[0]).catch((e) => {
                  return res.status(200).json({
                    error: 'Un Problème est survenu.'
                  })
                })
                return res.status(201).json({
                  success: 'Informations Utilisateur mise à jour.'
                })
              }
              if (emailE !== emailDB) {
                const user = await users.findByEmail(emailE)
                if (user.length > 0) return res.status(200).json({
                  error: 'L\'email à déjà été utilisé'
                });
                let newArray = [];
                newArray.push({
                  email: req.body.email,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname
                })
                await users.updateUser(id, newArray[0]).catch((e) => {
                  if (e) return res.status(500)
                })
                return res.status(201).json({
                  success: 'Informations Utilisateur mise à jour.'
                })
              }
              let newArray = [];
              newArray.push({
                firstname: req.body.firstname,
                lastname: req.body.lastname
              })
              await users.updateUser(id, newArray[0]).catch((e) => {
                return res.status(200).json({
                  error: 'Un Problème est survenu.'
                })
              })
              return res.status(201).json({
                success: 'Informations Utilisateur mise à jour.'
              })
            }
            return res.status(200).json({
              error: 'Veuillez vérifier vos mot de passe.'
            })
          }
        }
        return res.status(200).json({
          error: 'Veuillez saisir les infos à modifier.'
        });

      }
      return res.status(200).json({
        error: 'Veuillez vérifier l\' ID fournis.'
      });
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  deleteUser: async (req, res) => {
    const {
      user_id
    } = req.params;
    console.log(req.params, user_id)
    try {
      if (!user_id || isNaN(user_id)) return res.status(200).json({
        error: 'Veuillez vérifier l\' ID fournis.'
      })
      if (req.user.userId == user_id) {
        const usertofind = await users.findByIdUser(user_id).then((res) => res).catch((e) => console.error(e));
        if (usertofind.length != 0) {
          await users.deleteUser(user_id).catch((e) => {
            return res.status(200).json({
              error: 'Un Problème est survenu.'
            })
          })
          return res.status(201).json({
            success: 'Utilisateur supprimé avec succès.'
          });

        }
        return res.status(200).json({
          error: 'Veuillez vérifier l\' ID fournis.'
        });
      }
      return res.status(200).json({
        error: 'Veuillez vérifier l\' ID fournis.'
      });
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  getRank: async (_, res) => {
    try {
      const result = await users.getRank()
      return res.status(201).json(result)
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
  getRankLimited: async (_, res) => {
    try {
      const result = await users.getRankLimited()
      return res.status(201).json(result)
    } catch (e) {
      return res.status(200).json({
        error: 'Un Problème est survenu.'
      })
    }
  },
};
module.exports = userController;
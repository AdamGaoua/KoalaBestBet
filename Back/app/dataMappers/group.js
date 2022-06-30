const db = require('../config/database');
const groupDataMapper = {
    createGroup: async function (groupName, invitation_link, players_number, group_leader_id) {
        const query = {
            text: `INSERT INTO "group" (name, invitation_link, players_number, group_leader_id) VALUES ($1, $2, $3, $4)`,
            values: [groupName, invitation_link, players_number, group_leader_id]
        };
        const result = await db.query(query);
        return result.rows;
    },
    getGroupIdByGroupName: async function (groupName) {
        const query = {
            text: `SELECT id FROM "group" WHERE lower(name) = $1`,
            values: [groupName]
        };
        const result = await db.query(query);
        return result.rows[0];
    },
    getGroupById: async function (group_id) {
        const query = {
            text: `SELECT * FROM "group" WHERE id = $1`,
            values: [group_id]
        };
        const result = await db.query(query);
        return result.rows[0];
    },
    linkGroupAndUser: async function (group_id, user_id) {
        const query = {
            text: `INSERT INTO "participe" (group_id, user_id, "hasBet") VALUES ($1, $2, false)`,
            values: [group_id, user_id]
        };
        console.log(query)
        const result = await db.query(query);
        return result.rows;
    },
    deleteGroup: async function (user_id) {
        const query = {
            text: `DELETE from "group" WHERE id = $1`,
            values: [user_id]
        };
        const result = await db.query(query);
        return result.rows;
    },
    LinkMatchsForOneGroup: async function (group_id, matchs_id) {
        const query = {
            text: `INSERT INTO "appartient" (group_id, match_id) VALUES ($1, (SELECT id FROM "match" WHERE match_pandascore = $2))`,
            values: [group_id, matchs_id]
        };
        const result = await db.query(query);
        return result.rows;
    },
    addMatchsToGroup: async function (group_id, matchs_id) {
        const query = {
            text: `INSERT INTO "appartient" (group_id, match_id) VALUES ($1, $2)`,
            values: [group_id, matchs_id]
        };
        const result = await db.query(query);
        return result.rows;

    },
    addMatchsToDatabase: async function (match_id) {
        const query = {
            text: `INSERT INTO "match" (match_pandascore) VALUES ( $1 ) ON CONFLICT(match_pandascore) DO NOTHING`,
            values: [match_id],
        };
        const result = await db.query(query).then((e) => e).catch((e) => console.error(e));;
        return result.rows[0];

    },
    findIfMatchIsAllready: async function (match_id) {
        const query = {
            text: `SELECT * FROM "match" WHERE match_pandascore =  ( $1 ) `,
            values: [match_id],
        };
        const result = await db.query(query).then((e) => e).catch((e) => console.error(e));;
        return result.rows[0];

    },

    verifyValidityOfInvitationLink: async function (invitation_link) {
        const query = {
            text: `SELECT * FROM "group" WHERE lower(invitation_link) = $1`,
            values: [invitation_link]
        };
        const result = await db.query(query);
        return result.rows;
    },
    getInfosFromGroup: async function (group_id) {
        const query = {
            text: `SELECT "p"."group_id", "p"."user_id", "u"."id", "u"."username", "g"."group_leader_id"
            FROM "user" u
            INNER JOIN participe p
                ON p.user_id = u.id
            LEFT JOIN "group" g
                ON p.group_id = g.id
            WHERE "g"."id" = $1
                AND "p"."group_id" = $1`,
            values: [group_id]
        };
        const result = await db.query(query);
        return result.rows;
    },
    getAllInfosFromGroupByUserId: async function (group_id, user_id) {
        const query = {
            text: ` SELECT "p"."group_id", "g"."name", count("p"."user_id") AS nb_participants , "g"."players_number" AS nb_participants_max,
            bool_or(case when user_id = $2 then "p"."hasBet" end) AS "hasBet"
            FROM "participe" p 
            INNER JOIN "group" g ON "g"."id" = "p"."group_id"
            WHERE "p"."group_id" 
            IN ( SELECT group_id FROM participe WHERE user_id = $2 AND group_id = $1)
             GROUP BY "p"."group_id", "g"."name", "g"."players_number"`,
            values: [group_id, user_id]
        };
        const result = await db.query(query);
        return result.rows;
    },

    getLeaderFromGroup: async function (user_id) {
        const query = {
            text: `SELECT "p"."group_id", "u"."id", "u"."username", "g"."group_leader_id"
            FROM "user" u
            INNER JOIN participe p
                ON p.user_id = u.id
            INNER JOIN "group" g
                ON p.group_id = g.id
            WHERE "u"."id" = $1
                AND "g"."group_leader_id" = $1`,
            values: [user_id]
        };
        const result = await db.query(query);
        return result.rows;
    },
    getGroupsOfUser: async function (user_id) {
        const query = {
            text: `SELECT "p"."group_id", "g"."name", count("p"."user_id") AS nb_participants , "g"."players_number" AS nb_participants_max,
            bool_or(case when user_id = $1 then "p"."hasBet" end) AS "hasBet"
            FROM "participe" p 
            INNER JOIN "group" g ON "g"."id" = "p"."group_id"
            WHERE "p"."group_id" 
            IN ( SELECT group_id FROM participe WHERE user_id = $1)
             GROUP BY "p"."group_id", "g"."name", "g"."players_number" `,
            values: [user_id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    getInfosGroupsByUserId: async function (group_id, user_id) {
        const query = {
            text: `SELECT "p"."group_id","p"."user_id", "m"."id", "m"."match_pandascore"
                    FROM "participe" p
                    FULL JOIN appartient a
                        ON p.group_id = a.group_id
                    FULL JOIN "user" u
                        ON u.id = a.user_id
                    WHERE "a"."group_id" = $1`,
            values: [group_id, user_id]
        };
        const result = await db.query(query);
        return result.rows;
    },
    leaveGroup: async function (user_id, group_id) {
        const query = {
            text: `DELETE from "participe" WHERE user_id = $1 AND group_id = $2 `,
            values: [user_id, group_id]
        };
        const result = await db.query(query);
        return result.rows;
    },
    getResultOfGroup: async function (group_id, user_id) {
        const query = {
            text: `select "bet"."id", "match"."match_pandascore", "bet"."bet", "bet"."status", "bet"."is_winner", "bet"."group_id"
            from "bet"
            INNER JOIN "match" ON "bet"."match_id" = "match"."id" 
            WHERE ("bet"."group_id" = $1 AND "bet"."user_id" = $2)`,
            values: [group_id, user_id]
        }
        const result = await db.query(query).then((e) => e).catch((e) => console.error(e));
        return result.rows;
    },
    getMatchOfGroup: async function (group_id, user_id) {
        const query = {
            text: `SELECT "p"."group_id", "m"."id", "m"."match_pandascore"
            FROM "participe" p
            INNER JOIN appartient a
                ON p.group_id = a.group_id
            FULL JOIN "match" m
                ON a.match_id = m.id
            WHERE "a"."group_id" = $1
                AND "p"."user_id" = $2`,
            values: [group_id, user_id]
        }
        const result = await db.query(query).then((e) => e).catch((e) => console.error(e));
        return result.rows;
    },
    getRankOfGroup: async function (group_id) {
        const query = {
            text: `SELECT     "user"."id", "group"."name",
            "user"."username",
            Count(*) filter (WHERE is_winner)     AS "winning_bet",
            count("bet"."id")                     AS bet_total_number
            FROM       "bet"
             inner join "user"
            ON         "user"."id" = "bet"."user_id" INNER JOIN "group" ON "bet"."group_id" = "group"."id"
            WHERE      "bet"."group_id" = $1
            GROUP BY   "user"."id", "group"."name"
            ORDER BY   winning_bet DESC`,
            values: [group_id]
        }
        const result = await db.query(query).then((e) => e).catch((e) => console.error(e));
        return result.rows;
    },
};
module.exports = groupDataMapper;
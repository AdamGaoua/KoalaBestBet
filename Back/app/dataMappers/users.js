const db = require('../config/database');
const userDataMapper = {
  findByEmail: async function (email) {
    const query = {
      text: `SELECT * FROM "user" WHERE lower(email) = ($1)`,
      values: [email]
    };
    const result = await db.query(query);
    return result.rows;
  },
  findByUsername: async function (username) {
    const query = {
      text: `SELECT * FROM "user" WHERE lower(username) = ($1)`,
      values: [username]
    };
    const result = await db.query(query);
    return result.rows;
  },
  findByIdUser: async function (id) {
    const query = {
      text: `SELECT "u"."id", "u"."username", "u"."firstname", "u"."lastname", "u"."email", "u"."koalacoin", 
              CASE WHEN "u"."koalacoin" < 249 AND "u"."koalacoin" >= 100 THEN 'Koala Bronze' 
               WHEN "u"."koalacoin" < 349 AND "u"."koalacoin" >= 250 THEN 'Koala Silver'
               WHEN "u"."koalacoin" < 449  AND "u"."koalacoin" >= 350 THEN 'Koala Gold'
               WHEN "u"."koalacoin" < 699  AND "u"."koalacoin" >= 450 THEN 'Koala Platinum' 
               WHEN "u"."koalacoin" < 999 AND "u"."koalacoin" >= 700 THEN 'Koala Diamond'
              WHEN "u"."koalacoin" < 1149 AND "u"."koalacoin" >= 1000 THEN 'Koala Titanium'
              WHEN "u"."koalacoin" > 1250 THEN 'Koala Supreme'
              ELSE 'Super N00b' END
              AS grade , CASE WHEN "g"."group_leader_id" = "u"."id" THEN "g"."invitation_link" ELSE null END AS invitation_link,"a"."avatar_path"                                               
                                      FROM "user" u
                                      INNER JOIN "user_has_avatar" uha
                                      ON "uha"."user_id" = "u"."id"
                                      INNER JOIN "avatar" a
                                      ON "uha"."avatar_id" = "a"."id"
                                      LEFT JOIN "group" g
                                      ON "uha"."user_id" = "g"."group_leader_id" 
                                      WHERE "u"."id" = $1`,
      values: [id]
    };
    const result = await db.query(query);
    return result.rows;
  },
  updateUser: async function (id, userData) {
    const fields = Object.keys(userData).map((prop, index) => `"${prop}" = $${index + 1}`);
    const values = Object.values(userData);

    const result = await db.query(
      `
                    UPDATE "user" SET
                        ${fields} , updated_at = now()
                    WHERE id = $${fields.length + 1}
                    RETURNING *

                `,
      [...values, id],
    );

    return result.rows[0];
  },
  findAllInfosOfUser: async function (id) {
    const query = {
      text: `SELECT "u"."id", "u"."username", "u"."firstname", "u"."password", "u"."lastname", "u"."email", "u"."koalacoin"
                          FROM "user" u
                         WHERE "u"."id" = ($1)`,
      values: [id]
    };
    const result = await db.query(query);
    return result.rows;
  },
  createUser: async function (username, firstname, lastname, email, password, avatar_id) {
    const query = {
      text: `INSERT INTO "user" (username, firstname, lastname, email, password, koalacoin, avatar_id) VALUES ($1, $2, $3, $4, $5, 50, $6) returning id`,
      values: [username, firstname, lastname, email, password, avatar_id]
    };
    const result = await db.query(query);
    return result.rows;
  },
  linkUserAndAvatar: async function (user_id, avatar_id) {
    const query = {
      text: `INSERT INTO "user_has_avatar" (user_id, avatar_id) VALUES ($1, $2)`,
      values: [user_id, avatar_id]
    };
    const result = await db.query(query);
    return result.rows;
  },
  deleteUser: async function (id) {
    const query = {
      text: `DELETE FROM "user" WHERE id = $1`,
      values: [id]
    };
    const result = await db.query(query);
    return result.rows;
  },
  getRank: async function () {
    const query = {
      text: `select row_number() OVER ( ORDER BY "u"."koalacoin" DESC ) AS position, "u"."username", "u"."koalacoin",
                      CASE WHEN "u"."koalacoin" < 249 AND "u"."koalacoin" >= 100 THEN 'Koala Bronze' 
                                    WHEN "u"."koalacoin" < 349 AND "u"."koalacoin" >= 250 THEN 'Koala Silver'
                                    WHEN "u"."koalacoin" < 449  AND "u"."koalacoin" >= 350 THEN 'Koala Gold'
                                    WHEN "u"."koalacoin" < 699  AND "u"."koalacoin" >= 450 THEN 'Koala Platinum' 
                                    WHEN "u"."koalacoin" < 999 AND "u"."koalacoin" >= 700 THEN 'Koala Diamond'
                                    WHEN "u"."koalacoin" < 1149 AND "u"."koalacoin" >= 1000 THEN 'Koala Titanium'
                                    WHEN "u"."koalacoin" > 1250 THEN 'Koala Supreme'
                                    ELSE 'Super N00b' END
                                    AS grade from "user" u ORDER BY "u"."koalacoin" DESC`,
    }
    const result = await db.query(query).then((e) => e).catch((e) => console.error(e));
    return result.rows;
  },
  getRankLimited: async function () {
    const query = {
      text: `select row_number() OVER ( ORDER BY "u"."koalacoin" DESC ) AS position, "u"."username", "u"."koalacoin",
                      CASE WHEN "u"."koalacoin" < 249 AND "u"."koalacoin" >= 100 THEN 'Koala Bronze' 
                                    WHEN "u"."koalacoin" < 349 AND "u"."koalacoin" >= 250 THEN 'Koala Silver'
                                    WHEN "u"."koalacoin" < 449  AND "u"."koalacoin" >= 350 THEN 'Koala Gold'
                                    WHEN "u"."koalacoin" < 699  AND "u"."koalacoin" >= 450 THEN 'Koala Platinum' 
                                    WHEN "u"."koalacoin" < 999 AND "u"."koalacoin" >= 700 THEN 'Koala Diamond'
                                    WHEN "u"."koalacoin" < 1149 AND "u"."koalacoin" >= 1000 THEN 'Koala Titanium'
                                    WHEN "u"."koalacoin" > 1250 THEN 'Koala Supreme'
                                    ELSE 'Super N00b' END
                                    AS grade from "user" u ORDER BY "u"."koalacoin" DESC LIMIT 10`,
    }
    const result = await db.query(query)
    return result.rows;
  },
};
module.exports = userDataMapper;
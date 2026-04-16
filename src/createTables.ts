import { db } from "./db";

async function createTables() {
  await db.query(`
  CREATE TABLE IF NOT EXISTS matchzy_stats_matches (
      matchid INT PRIMARY KEY AUTO_INCREMENT,
      start_time DATETIME NOT NULL,
      end_time DATETIME DEFAULT NULL,
      winner VARCHAR(255) NOT NULL DEFAULT '',
      series_type VARCHAR(255) NOT NULL DEFAULT '',
      team1_name VARCHAR(255) NOT NULL DEFAULT '',
      team1_score INT NOT NULL DEFAULT 0,
      team2_name VARCHAR(255) NOT NULL DEFAULT '',
      team2_score INT NOT NULL DEFAULT 0,
      server_ip VARCHAR(255) NOT NULL DEFAULT '0'
  )`);

  await db.query(`
  CREATE TABLE IF NOT EXISTS matchzy_stats_maps (
      matchid INT NOT NULL,
      mapnumber TINYINT UNSIGNED NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME DEFAULT NULL,
      winner VARCHAR(16) NOT NULL DEFAULT '',
      mapname VARCHAR(64) NOT NULL DEFAULT '',
      team1_score INT NOT NULL DEFAULT 0,
      team2_score INT NOT NULL DEFAULT 0,
      PRIMARY KEY (matchid, mapnumber),
      FOREIGN KEY (matchid) REFERENCES matchzy_stats_matches (matchid)
  )`);

  await db.query(`
  CREATE TABLE IF NOT EXISTS matchzy_stats_players (
      matchid INT NOT NULL,
      mapnumber TINYINT UNSIGNED NOT NULL,
      steamid64 BIGINT NOT NULL,
      team VARCHAR(255) NOT NULL DEFAULT '',
      name VARCHAR(255) NOT NULL,
      kills INT NOT NULL,
      deaths INT NOT NULL,
      damage INT NOT NULL,
      assists INT NOT NULL,
      enemy5ks INT NOT NULL,
      enemy4ks INT NOT NULL,
      enemy3ks INT NOT NULL,
      enemy2ks INT NOT NULL,
      utility_count INT NOT NULL,
      utility_damage INT NOT NULL,
      utility_successes INT NOT NULL,
      utility_enemies INT NOT NULL,
      flash_count INT NOT NULL,
      flash_successes INT NOT NULL,
      health_points_removed_total INT NOT NULL,
      health_points_dealt_total INT NOT NULL,
      shots_fired_total INT NOT NULL,
      shots_on_target_total INT NOT NULL,
      v1_count INT NOT NULL,
      v1_wins INT NOT NULL,
      v2_count INT NOT NULL,
      v2_wins INT NOT NULL,
      entry_count INT NOT NULL,
      entry_wins INT NOT NULL,
      equipment_value INT NOT NULL,
      money_saved INT NOT NULL,
      kill_reward INT NOT NULL,
      live_time INT NOT NULL,
      head_shot_kills INT NOT NULL,
      cash_earned INT NOT NULL,
      enemies_flashed INT NOT NULL,
      PRIMARY KEY (matchid, mapnumber, steamid64),
      FOREIGN KEY (matchid, mapnumber)
        REFERENCES matchzy_stats_maps (matchid, mapnumber)
  )`);

  console.log("Tabelas criadas!");
  process.exit();
}

createTables();
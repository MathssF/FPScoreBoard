import { db } from "./db";
import { faker } from "@faker-js/faker";

function rand(min:number,max:number){ 
  return Math.floor(Math.random()*(max-min+1))+min;
}

async function seed() {

  for (let m = 1; m <= 3; m++) {
    const [result]: any = await db.query(`
      INSERT INTO matchzy_stats_matches
      (start_time, series_type, team1_name, team2_name, server_ip)
      VALUES (NOW(),'BO3','Team Alpha','Team Bravo','127.0.0.1')
    `);

    const matchId = result.insertId;

    for (let map = 1; map <= 3; map++) {

      await db.query(`
        INSERT INTO matchzy_stats_maps
        (matchid,mapnumber,start_time,mapname)
        VALUES (?,?,NOW(),'de_dust2')
      `,[matchId,map]);

      for (let p = 0; p < 10; p++) {
        await db.query(`
        INSERT INTO matchzy_stats_players VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,[
          matchId,map,
          faker.number.bigInt({min:76561197960265728n,max:76561199999999999n}),
          p<5?'Team Alpha':'Team Bravo',
          faker.internet.username(),
          rand(5,30),rand(5,30),rand(500,3000),rand(0,10),
          rand(0,1),rand(0,2),rand(0,4),rand(0,6),
          rand(1,20),rand(50,400),rand(1,10),rand(1,10),
          rand(1,10),rand(1,10),
          rand(200,2000),rand(200,2000),
          rand(50,400),rand(10,200),
          rand(0,5),rand(0,5),rand(0,5),rand(0,5),
          rand(0,10),rand(0,10),
          rand(2000,10000),rand(0,3000),rand(0,3000),
          rand(100,2000),rand(0,20),
          rand(1000,16000),rand(0,20)
        ]);
      }
    }
  }

  console.log("Banco populado 🚀");
  process.exit();
}

seed();
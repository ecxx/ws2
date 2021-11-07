var espn_fsl = require('./espn_generator.js')
var fsl = require('./fsl_generator.js')

module.exports = async function generate_all_refspecs () {

    refspec_list = []
    game_list = []

    espn_fsl_result = await espn_fsl();
    refspec_list.push(espn_fsl_result.refspec)
    game_list.push(espn_fsl_result.games)

    ncaaf_fsl_result = await fsl("NCAAF", "NCAA Football", "http://vod.freestreams-live1.com/ncaaf-live-streams/");
    refspec_list.push(ncaaf_fsl_result.refspec)
    game_list.push(ncaaf_fsl_result.games)

    soccer_fsl_result = await fsl("SOCCER", "Soccer (League Unknown)", "http://vod.freestreams-live1.com/football-streamz5/");
    refspec_list.push(soccer_fsl_result.refspec)
    game_list.push(soccer_fsl_result.games)

    var refspec = {}
    var games = {}

    refspec_list.forEach((ref) => {
        Object.assign(refspec, ref);
    })

    game_list.forEach((game) => {
        Object.assign(games, game);
    })

    return {
        games: games,
        refspec: refspec
    }

}
/**
 * Checks for a previous bot comment, if found returns the commen
 */
async function checkComments(issues,pull){
    const comments = await issues.getComments(pull)
    let result 
//iterates over all the comments
  for (comment of comments['data']){
    if(comment.user.login=='testing-bot[bot]'&&comment.user.type=='Bot'){ //looks for the first comment made by the bot
    result = comment
    break
    }
  }

  return result
}

module.exports = checkComments
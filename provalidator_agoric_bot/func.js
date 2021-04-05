const fetch = require('sync-fetch')
require('dotenv').config()
const logger = require('./log4js').log4js//logger
const fs = require('fs')
const numeral = require('numeral')

function getMessage(coin){
	let msg = ``
	let price = ``
	let maxTokens = ``
	let stakedTokens = ``
	let totalTokens = ``
	let stakedPercent = ``
	let totalPercent = ``
	let teamTokens = ``
	let communityTokens = ``
	let communityPercent = ``
		
	try {
		//no file = create
		let file = `./json/${coin}.json`
		let rJson = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : ''
		var wdate = fs.existsSync(file) ? parseInt(rJson.wdate) + (60 * 1000) : 0
		var cdate = parseInt(new Date().getTime())
		
		if(coin == 'agoric'){
			msg = `💫 <b>Agoric</b>\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n\n`
			if( wdate <  cdate) {
				maxTokens = (getTokenTotal(coin) / 1000000).toFixed(0)
				stakedTokens = (getStaked(coin) / 1000000 ).toFixed(0)
				stakedPercent = (stakedTokens / maxTokens * 100).toFixed(2)
				notStakedTokens = maxTokens - stakedTokens
				notStakedPercent = (notStakedTokens / maxTokens * 100).toFixed(2)
				let wJson = {
					"maxTokens" : maxTokens,
					"stakedTokens" : stakedTokens,
					"stakedPercent" : stakedPercent,
					"notStakedTokens" : notStakedTokens,
					"notStakedPercent" : notStakedPercent,
					"wdate" : new Date().getTime()
				}
				fs.writeFileSync(file, JSON.stringify(wJson))
			}else{
				maxTokens = rJson.maxTokens
				stakedTokens = rJson.stakedTokens
				stakedPercent = rJson.stakedPercent
				notStakedTokens = rJson.notStakedTokens
				notStakedPercent = rJson.notStakedPercent
			}
			msg += `🥩<b>Staking</b>\n\n`
			msg += `📌maxTokens : ${numberWithCommas(maxTokens)} (100%)\n📌stakedTokens : ${numberWithCommas(stakedTokens)} (${stakedPercent}%)\n📌notStakedTokens : ${numberWithCommas(notStakedTokens)} (${notStakedPercent}%)`
			msg += `\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n`
			msg += `Supported by <b>Provalidator</b>\n`
		}	

		return msg
	}catch(err){
		logger.error(`=======================func error=======================`)
		logger.error(err)
		return null
	}
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function getStaked(){
	let url = process.env.AG_API_URL+'/staking/pool'
	let json = fetch(url).json()
	return json.result.bonded_tokens
}

function getTokenTotal(){
	let url = process.env.AG_API_URL+'/bank/total'
	let tokenDenom = 'uagstake'
	let json = fetch(url).json()
	let jsonResult = json.result
	
	for(var i=0; i<jsonResult.length; i++){
		if(jsonResult[i].denom == tokenDenom){
			return jsonResult[i].amount
		}	
	}
}

module.exports = {
	getMessage : getMessage
}
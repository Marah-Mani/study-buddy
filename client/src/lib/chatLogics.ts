export const getSender = (loggedUser: any, users: any) => {
	return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const isSameSender = (messages: any, m: any, i: any, userId: any) => {
	return (
		i < messages.length - 1 &&
		(messages[i + 1].sender._id !== m.sender._id || messages[i + 1].sender._id === undefined) &&
		messages[i].sender._id !== userId
	);
};

export const isLastMessage = (messages: any, i: any, userId: any) => {
	return (
		i === messages.length - 1 &&
		messages[messages.length - 1].sender._id !== userId &&
		messages[messages.length - 1].sender._id
	);
};

export const getSenderFull = (loggedUser: any, users: any) => {
	return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const bannedWords = [
	'abuse', 'abusive', 'bastard', 'bitch', 'bullshit', 'cocksucker', 'crap', 'cunt', 'damn', 'dick', 'douche', 'fag', 'faggot',
	'fuck', 'fucking', 'motherfucker', 'nigger', 'piss', 'prick', 'shit', 'slut', 'whore', 'wanker',
	'ass', 'arse', 'asshole', 'balls', 'bastards', 'bitching', 'bollocks', 'bugger', 'choad', 'clit',
	'cock', 'cum', 'cumming', 'dammit', 'dickhead', 'dildo', 'dyke', 'fagging', 'fuckface', 'fuckhead', 'goddamn',
	'gook', 'hell', 'homo', 'jizz', 'kike', 'mothafucka', 'mothafuckin', 'nigga', 'nutsack', 'pussy', 'shitass',
	'shitbag', 'shithead', 'shithole', 'shithouse', 'shitty', 'skank', 'twat', 'wetback',
	'a-hole', 'anal', 'anus', 'ballbag', 'ballsack', 'barf', 'bastard', 'beeyotch', 'belend', 'bimbo',
	'blowjob', 'bollock', 'boob', 'bugger', 'bum', 'butt', 'buttfucka', 'butthead', 'buttplug',
	'c0ck', 'c0cksucker', 'cawk', 'choade', 'cl1t', 'clits', 'clitty', 'clitz', 'clunge', 'clusterfuck', 'cocksucka',
	'coochie', 'coon', 'cooter', 'cornhole', 'crap', 'cumdumpster', 'cumslut', 'cumstain', 'cuntass', 'cuntface', 'cunthole',
	'cuntlicker', 'cuntslut', 'dickcheese', 'dickhead', 'dicklicker', 'dicksucker', 'dildo', 'dingleberry', 'dipshit', 'doggy',
	'doggystyle', 'dogshit', 'dookie', 'douchebag', 'dyke', 'f4g', 'fagbag', 'fagfucker', 'fagtard', 'fanny', 'fart', 'fatass',
	'fck', 'felching', 'fingerfuck', 'fingerfucker', 'fistfuck', 'fistfucker', 'foreskin', 'frigger', 'fuck', 'fuckass', 'fuckbag',
	'fuckboy', 'fuckbrain', 'fuckbutt', 'fuckdick', 'fucker', 'fuckhole', 'fuckin', 'fucking', 'fuckknob', 'fucknut', 'fucknutt',
	'fuckoff', 'fuckstick', 'fuckup', 'fuckwad', 'fuckwit', 'fudgepacker', 'gangbang', 'gay', 'gaylord', 'gaysex', 'goddammit',
	'goddamnit', 'hardon', 'heeb', 'homo', 'humping', 'jackass', 'jackhole', 'jackingoff', 'jagoff', 'jerkoff', 'jizzm', 'jizzz',
	'jizzed', 'kike', 'klit', 'knobend', 'knobjocky', 'knobjockey', 'kock', 'kooch', 'kootch', 'kunt', 'labia', 'lardass', 'lesbo',
	'mcfuck', 'minge', 'mothafuck', 'mothafucka', 'mothafuckin', 'motherfuck', 'motherfucka', 'motherfuckin', 'muff', 'muffdive',
	'munging', 'nutting', 'nutsack', 'orgasm', 'penis', 'pissflap', 'polesmoker', 'poon', 'poonani', 'poonany', 'poontang', 'punani',
	'punany', 'punkass', 'punta', 'puntang', 'pussies', 'pussy', 'queef', 'queer', 'quim', 'rectum', 'rimjob', 'scroat', 'scrote',
	'sh1t', 'shit', 'shitass', 'shitbag', 'shitbrain', 'shitbreath', 'shitcunt', 'shitdick', 'shitface', 'shitfaced', 'shitfuck',
	'shithead', 'shithole', 'shithouse', 'shitstain', 'shitter', 'shittiest', 'shitting', 'shitty', 'skank', 'slag', 'slut', 'smut',
	'sodding', 'spunk', 'suckmydick', 'tard', 'testicle', 'tit', 'tits', 'tittie', 'titties', 'twat', 'twatty', 'twatwaffle', 'vagina',
	'vajayjay', 'wank', 'wankjob', 'whore', 'wop'
	// Add more words as necessary
];


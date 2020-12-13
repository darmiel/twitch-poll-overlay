export interface Reaction {
  sorting: number;
  display: string;
  keywords: string[];
}

const reactions: Reaction[] = [
  {
    sorting: 0,
    display: "+1",
    keywords: ["+1", "1", "yes", "ye", "ja", "sure", "yay"],
  },
  {
    sorting: 2,
    display: "~",
    keywords: ["2"],
  },
  {
    sorting: 3,
    display: "-1",
    keywords: ["-1", "0", "no", "nein", "nay"],
  },
];


export function getReaction(kwmsg: string, keywordOnly: boolean = false): Reaction | null {
  if (keywordOnly) {
    return getReactionByKeyword(kwmsg);
  } else {
    return getReactionByMessage(kwmsg);
  }
}

/**
 * This method checks if the message contains a keyword of a reaction and returns it if one was found.
 * Otherwise null
 *
 * @param keyword Keyword to check
 */
export function getReactionByKeyword(keyword: string): Reaction | null {
  keyword = keyword.toLowerCase();

  for (let i: number = 0; i < reactions.length; i++) {
    const reaction: Reaction = reactions[i];
    for (let j: number = 0; j < reaction.keywords.length; j++) {
      if (reaction.keywords[j] == keyword) {
        return reaction;
      }
    }
  }

  return null;
}

export function getReactionByMessage(message: string): Reaction | null {
  const keywords: string[] = message.split(" ");
  if (keywords.length == 0) {
    return null;
  }
  if (keywords.length == 1) {
    return getReactionByKeyword(keywords[0]);
  }

  const found: Set<Reaction> = new Set();

  for (let k: number = 0; k < keywords.length; k++) {
    const msgkw: string = keywords[k].toLowerCase();
    
    for (let i: number = 0; i < reactions.length; i++) {
      const reaction: Reaction = reactions[i];
      for (let j: number = 0; j < reaction.keywords.length; j++) {
        if (reaction.keywords[j] == msgkw) {
          found.add(reaction);
        }
      }
    }
  }
  
  if (found.size == 1) {
    return found.values().next().value;
  }

  return null;
}

export { reactions };

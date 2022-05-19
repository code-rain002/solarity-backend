export const userAddFields = {
  profileImageLink: "$profileImage.link",
  profileImageAddress: "$profileImage.address",
  twitterUsername: "$externalLinks.twitter.username",
  githubUsername: "$externalLinks.github.username",
  discordUsername: "$externalLinks.discord.username",
  discordConnected: "$externalLinks.discord.connected",
  twitterConnected: "$externalLinks.twitter.connected",
};

export const userUnsetFields = [
  "following",
  "createdAt",
  "updatedAt",
  "nonce",
  "profileImage",
  "stepsCompleted",
  "visible",
  "externalLinks",
];

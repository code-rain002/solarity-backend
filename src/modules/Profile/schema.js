import * as yup from "yup";

export const updatePublicAddressSchema = yup.object({
  body: yup.object({
    publicAddress: yup
      .string()
      .typeError("Public address must be a string")
      .required("The public address is required"),
    signedUserId: yup
      .string()
      .typeError("The signed user ID must be a string")
      .required("The signed user ID is required"),
  }),
});

export const buyRoomSchema = yup.object({
  body: yup.object({
    title: yup
      .string()
      .typeError("Title must be a string")
      .required("The title is required"),
    imageUrl: yup
      .string()
      .typeError("The image url must be a string")
      .required("The image url is required"),
    currentBid: yup
      .string()
      .typeError("The current bid price must be a number")
      .required("The current bid price is required"),
    roomNo: yup
      .string()
      .typeError("The current bid roomNo must be a number")
      .required("The current bid roomNo is required"),
  }),
});

export const checkRoomSchema = yup.object({
  body: yup.object({
    roomNo: yup
      .string()
      .typeError("The current bid roomNo must be a number")
      .required("The current bid roomNo is required"),
  }),
});

export const setActiveRoomSchema = yup.object({
  body: yup.object({
    roomNo: yup
      .string()
      .typeError("The current bid roomNo must be a number")
      .required("The current bid roomNo is required"),
  }),
});

export const updatePasswordSchema = yup.object({
  body: yup.object({
    currentPassword: yup
      .string()
      .typeError("Current password must be a string")
      .required("Current password is required"),
    newPassword: yup
      .string()
      .typeError("New Password must be a string")
      .required("New Password is required"),
  }),
});

export const updateProfileSchema = yup.object({
  body: yup.object({
    fullName: yup
      .string()
      .trim()
      .typeError("Full name is invalid")
      .min(4, "Full name is too short")
      .max(60, "Full name is too long")
      .nullable(),
    username: yup
      .string()
      .trim()
      .typeError("Username is invalid")
      .min(3, "Username is too short")
      .max(60, "Username is too long")
      .nullable(),
    bio: yup
      .string()
      .trim()
      .typeError("Bio is invalid")
      .min(10, "Bio is too short")
      .max(500, "Bio is too long")
      .nullable(),
    email: yup.string().email().trim().typeError("Email is invalid").nullable(),
    githubUsername: yup
      .string()
      .trim()
      .typeError("Github username is invalid")
      .nullable(),
    discordHandle: yup
      .string()
      .trim()
      .typeError("Discord handle is invalid")
      .nullable(),
    twitterUsername: yup
      .string()
      .trim()
      .typeError("Twitter Username handle is invalid")
      .nullable(),
  }),
});

export const setupProfileInfoSchema = yup.object({
  body: yup.object({
    username: yup
      .string()
      .trim()
      .typeError("Username is invalid")
      .min(3, "Username is too short")
      .max(60, "Username is too long")
      .required("Username is required"),
    githubUsername: yup
      .string()
      .trim()
      .typeError("Github username is invalid")
      .required("Github username is required"),
    discordHandle: yup
      .string()
      .trim()
      .typeError("Discord handle is invalid")
      .required("Discord Handle is required"),
    twitterUsername: yup
      .string()
      .trim()
      .typeError("Twitter Username handle is invalid")
      .required("Twitter Username is required"),
  }),
});

export const connectTwitterSchema = yup.object({
  body: yup.object({
    username: yup
      .string()
      .typeError("Twitter username must be a string")
      .required("Twitter username is required"),
  }),
});

export const profilePicSchema = yup.object({
  body: yup.object({
    mint: yup
      .string()
      .typeError("Nft mint address must be a string")
      .required("NFT mint address is required"),
  }),
});

export const selectNftsForRoomSchema = yup.object({
  body: yup.object({
    roomId: yup
      .string()
      .typeError("Room Id must be a string")
      .required("Room Id is required"),
    picNo: yup
      .string()
      .typeError("Picture no must be a string")
      .required("Picture no is required"),
    mintAddress: yup
      .string()
      .typeError("Nft mint address must be a string")
      .required("NFT mint address is required"),
    link: yup
      .string()
      .typeError("Location must be a string")
      .required("Location is required"),
  }),
});

export const linkAccountSchema = yup.object({
  body: yup.object({
    link: yup
      .string()
      .required("The account link name is required")
      .oneOf(["discord", "twitter", "ethereum", "solana"]),
    code: yup.string().when("link", (link) => {
      if (!["solana", "ethereum"].includes(link)) {
        return yup.string().required("Code is required");
      }
    }),
    url: yup.string().when("link", (link) => {
      if (!["solana", "ethereum"].includes(link)) {
        return yup.string().required("URL is required");
      }
    }),
    signature: yup.string().when("link", (link) => {
      if (["solana", "ethereum"].includes(link)) {
        return yup.string().required("Signature is required");
      }
    }),
    walletAddress: yup.string().when("link", (link) => {
      if (["solana", "ethereum"].includes(link)) {
        return yup.string().required("Wallet address is required");
      }
    }),
  }),
});

export const unlinkAccountSchema = yup.object({
  body: yup.object({
    link: yup
      .string()
      .required("The account link name is required")
      .oneOf(["discord", "twitter", "ethereum", "solana"]),
  }),
});

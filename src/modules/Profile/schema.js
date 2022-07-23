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
    username: yup
      .string()
      .trim()
      .typeError("Username is invalid")
      .min(3, "Username is too short")
      .max(60, "Username is too long")
      .nullable(),
    bio: yup.string().trim().typeError("Bio is invalid").nullable(),
  }),
});

export const updateUserInfoSchema = yup.object({
  body: yup.object({
    domain: yup
      .string()
      .trim()
      .typeError("Domain name is invalid")
      .min(3, "Domain name is too short")
      .max(60, "Domain name is too long")
      .required("The domain name is required"),
    title: yup.string().trim().typeError("Title is invalid").nullable(),
  }),
});

export const profileSetupSchema = yup.object({
  body: yup.object({
    action: yup
      .string()
      .oneOf(["info", "link", "profilePic", "dao"])
      .required("The setup action is required"),
    username: yup.string().when("action", (action) => {
      if (action === "info") {
        return yup
          .string()
          .trim()
          .typeError("Username is invalid")
          .min(3, "Username is too short")
          .max(60, "Username is too long")
          .required("Username is required");
      }
    }),
    bio: yup.string().trim().typeError("Bio is invalid"),
    skipImage: yup.boolean(),
    imageNetwork: yup
      .string()
      .when(["action", "skipImage"], (action, skipImage) => {
        if (action === "profilePic" && !skipImage) {
          return yup
            .string()
            .oneOf(["Solana", "Ethereum"])
            .required("NFT mint address is required");
        }
      }),
    mintAddress: yup
      .string()
      .when(
        ["action", "imageNetwork", "skipImage"],
        (action, imageNetwork, skipImage) => {
          if (
            action === "profilePic" &&
            imageNetwork == "Solana" &&
            !skipImage
          ) {
            return yup
              .string()
              .typeError("NFT mint address must be a string")
              .required("NFT mint address is required");
          }
        }
      ),
    contractAddress: yup
      .string()
      .when(
        ["action", "imageNetwork", "skipImage"],
        (action, imageNetwork, skipImage) => {
          if (
            action === "profilePic" &&
            imageNetwork == "Ethereum" &&
            !skipImage
          ) {
            return yup
              .string()
              .typeError("NFT contract address must be a string")
              .required("NFT contract address is required");
          }
        }
      ),
    tokenId: yup
      .string()
      .when(
        ["action", "imageNetwork", "skipImage"],
        (action, imageNetwork, skipImage) => {
          if (
            action === "profilePic" &&
            imageNetwork == "Ethereum" &&
            !skipImage
          ) {
            return yup
              .string()
              .typeError("NFT token ID must be a string")
              .required("NFT token ID is required");
          }
        }
      ),
  }),
});

export const profileInitSchema = yup.object({
  body: yup.object({
    action: yup
      .string()
      .oneOf(["info", "link", "profilePic", "dao"])
      .required("The setup action is required"),
    // username: yup.string().when("action", (action) => {
    //   if (action === "info") {
    //     return yup
    //       .string()
    //       .trim()
    //       .typeError("Username is invalid")
    //       .min(3, "Username is too short")
    //       .max(60, "Username is too long")
    //       .required("Username is required");
    //   }
    // }),
    domain: yup.string().when("action", (action) => {
      if (action === "info") {
        return yup
          .string()
          .trim()
          .typeError("Domain is invalid")
          .min(3, "Domain is too short")
          .max(60, "Domain is too long")
          .required("Domain is required");
      }
    }),
    // bio: yup.string().trim().typeError("Bio is invalid"),
    title: yup.string().trim().typeError("Title is invalid"),
    skipImage: yup.boolean(),
    imageNetwork: yup
      .string()
      .when(["action", "skipImage"], (action, skipImage) => {
        if (action === "profilePic" && !skipImage) {
          return yup
            .string()
            .oneOf(["Solana", "Ethereum"])
            .required("NFT mint address is required");
        }
      }),
    mintAddress: yup
      .string()
      .when(
        ["action", "imageNetwork", "skipImage"],
        (action, imageNetwork, skipImage) => {
          if (
            action === "profilePic" &&
            imageNetwork == "Solana" &&
            !skipImage
          ) {
            return yup
              .string()
              .typeError("NFT mint address must be a string")
              .required("NFT mint address is required");
          }
        }
      ),
    contractAddress: yup
      .string()
      .when(
        ["action", "imageNetwork", "skipImage"],
        (action, imageNetwork, skipImage) => {
          if (
            action === "profilePic" &&
            imageNetwork == "Ethereum" &&
            !skipImage
          ) {
            return yup
              .string()
              .typeError("NFT contract address must be a string")
              .required("NFT contract address is required");
          }
        }
      ),
    tokenId: yup
      .string()
      .when(
        ["action", "imageNetwork", "skipImage"],
        (action, imageNetwork, skipImage) => {
          if (
            action === "profilePic" &&
            imageNetwork == "Ethereum" &&
            !skipImage
          ) {
            return yup
              .string()
              .typeError("NFT token ID must be a string")
              .required("NFT token ID is required");
          }
        }
      ),
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

export const updateProfileDaosSchema = yup.object({
  body: yup.object({
    domain: yup
      .string()
      .typeError("Domain must be a string")
      .required("Domain is required"),
  }),
});

export const updateNftAddressSchema = yup.object({
  body: yup.object({
    userId: yup
      .string()
      .required("User ID is required"),
    nftAddress: yup
      .string()
      .required("NFT address is required"),
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

export const getFollowingSchema = yup.object({
  query: yup.object({
    type: yup
      .string()
      .oneOf(["user", "dao"], "Type can only be 'user' or 'dao'")
      .required("Type is required"),
  }),
});

export const undoSetupSchema = yup.object({
  body: yup.object({
    stepName: yup
      .string()
      .oneOf(["info", "link", "profilePic", "dao"], "Invalid step name")
      .required("Step name is required"),
  }),
});

export const profileImageUpdateSchema = yup.object({
  body: yup.object({
    imageNetwork: yup
      .string()
      .oneOf(["Solana", "Ethereum"])
      .required("NFT mint address is required"),
    mintAddress: yup.string().when(["imageNetwork"], (imageNetwork) => {
      if (imageNetwork == "Solana") {
        return yup
          .string()
          .typeError("NFT mint address must be a string")
          .required("NFT mint address is required");
      }
    }),
    contractAddress: yup.string().when(["imageNetwork"], (imageNetwork) => {
      if (imageNetwork == "Ethereum") {
        return yup
          .string()
          .typeError("NFT contract address must be a string")
          .required("NFT contract address is required");
      }
    }),
    tokenId: yup.string().when(["imageNetwork"], (action, imageNetwork) => {
      if (imageNetwork == "Ethereum") {
        return yup
          .string()
          .typeError("NFT token ID must be a string")
          .required("NFT token ID is required");
      }
    }),
  }),
});

export const uploadProfilePicSchema = yup.object({
  body: yup.object({
    fileBlob: yup
      .string()
      .required("Upload image file is required"),
    fileName: yup
      .string()
      .typeError("File name must be a string")
      .required("File name is required"),
    fileSize: yup
      .number()
      .typeError('Must be a specified number')
      .min(0, 'File size must be more than 0MB.')
      .max(1024 * 1024 * 5, 'File size must be less than 5MB')
      .required("File size field is required"),
    filePath: yup
      .string()
      .nullable(),
  }),
});

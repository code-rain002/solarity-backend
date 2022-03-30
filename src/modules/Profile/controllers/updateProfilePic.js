import { successResponse, errorResponse } from "../../../helpers";
import UserModel from "../../User/model";
import _ from "lodash";
import axios from "axios";
import { isProfileVisible } from "../helpers";

export const updateProfilePicController = async (req, res) => {
  try {
    const {
      body: { mint },
      session: { userId },
    } = req;
    // check if the user is the owner of the nft
    // const {
    //   account: { owner: nftOwnerAddress },
    // } = await getParsedAccountByMint({
    //   mintAddress: mint,
    //   connection: req.solanaConnection,
    // });
    const profile = await req.profile();

    // if (profile.publicAddress !== nftOwnerAddress) {
    //   throwError("The NFT is not owned by you");
    // }

    const { data: nftDetails } = await axios.get(
      `https://api-mainnet.magiceden.dev/v2/tokens/${mint}`
    );

    const profileImageUpdates = {
      link: nftDetails.image,
      address: mint,
    };
    profile.profileImage = profileImageUpdates;
    profile.stepsCompleted.profilePicUpdated = true;
    profile.profileImageLink = nftDetails.image;
    profile.profileImageAddress = nftDetails.mint;
    const visible = isProfileVisible(profile);
    profile.visible = visible;
    await UserModel.updateOne(
      { _id: userId },
      {
        profileImage: profileImageUpdates,
        stepsCompleted: profile.stepsCompleted,
        visible,
      }
    );

    return successResponse({ res, response: { profile } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};

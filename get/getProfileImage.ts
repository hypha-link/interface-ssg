import { Profile } from "../components/utils/Types";

export default function getProfileImage(profile: Profile): string {
  return (
    profile?.image?.alternatives[0].src 
    ? `https://ipfs.io/ipfs/${profile.image.alternatives[0].src.substring(7, profile.image.alternatives[0].src.length)}`
    : `https://robohash.org/${profile?.address}.png?set=set5`
  );
}

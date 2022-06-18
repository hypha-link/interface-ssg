import { Profile } from "../components/utils/Types";

export default function getProfilePicture(profile: Profile): { image: string, background: string} {
  return (
    {
      image:
      profile?.image
      ? `https://ipfs.io/ipfs/${profile.image.alternatives[0].src.substring(7, profile.image.alternatives[0].src.length)}`
      : `https://robohash.org/${profile?.address}.png?set=set5`,
      background:
      profile?.background
      ? `https://ipfs.io/ipfs/${profile.background.original.src.substring(7, profile.background.original.src.length)}`
      : `https://robohash.org/${profile?.address}.png?set=set5`
    }
  )
}
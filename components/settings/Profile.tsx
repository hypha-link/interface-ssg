import React, { useContext } from 'react'
import styles from '../../styles/settings.module.css'
import { Edit, EditType } from '../utils/Edit'
import { StateContext } from '../context/AppState'
import getShortAddress from '../../get/getShortAddress'
import ProfileImage from '../ProfileImage'

export const Profile = () => {
    const { selfId, ownProfile, ipfs } = useContext(StateContext);

    const changeImage = async (newImage: string) => {
        await selfId.merge('basicProfile', {
            image: {
                original: {
                    src: newImage,
                    mimeType: "image/png",
                },
            },
        });
    }

    async function onChange(currentTarget: EventTarget & HTMLInputElement) {
        console.log(currentTarget.files[0].name);
        try {
          //Upload file, wait until completed, then send message
          ipfs.add(
            {
              path: currentTarget.files[0].name,
              content: currentTarget.files[0]
            }, 
            {
              wrapWithDirectory: true
            }
          ).then((res) => {
            changeImage(`https://ipfs.io/ipfs/${res.cid.toString()}/${currentTarget.files[0].name}`);
            console.log(res);
          });
        } catch (error) {
          console.log('Error uploading file: ', error)
        }
      }

    return (
        <div id={styles.profile}>
            <h2>Profile</h2>
            <div>
              <h3>Username:</h3>
              <div>
                  <p>{ownProfile?.name ? ownProfile.name : getShortAddress(ownProfile?.address)}</p>
                  <Edit type={EditType.Name}/>
              </div>
              <h3>Description:</h3>
              <div>
                  <p>{ownProfile && ownProfile?.description ? ownProfile.description : ''}</p>
                  <Edit type={EditType.Description}/>
              </div>
              <h3>Picture</h3>
              <div>
                <label id={styles.addFileLabel} htmlFor={styles.addFile}>
                    <ProfileImage profile={ownProfile} sizePx={150}/>
                    <div className={styles.imageOverlay}>Change</div>
                </label>
                <input 
                id={styles.addFile} 
                type="file" 
                onChange={() => window.open("https://clay.self.id/me/profile/edit")} 
                disabled={selfId === undefined}
                />
              </div>
            </div>
        </div>
    )
}

import React, { useContext } from 'react'
import Image from 'next/image'
import { shortenIfAddress } from '@usedapp/core'
import styles from '../../styles/settings.module.css'
import { Edit, EditType } from '../utils/Edit'
import { StateContext } from '../context/AppState'
import getProfileImage from '../../get/getProfileImage'

const IPFS = require('ipfs');

export const Profile = () => {
    const { selfId, ownProfile } = useContext(StateContext);

    const changeImage = async (newImage) => {
        await selfId.merge('basicProfile', {
            image: {
                original: {
                    src: newImage,
                    mimeType: "image/png",
                },
            },
        });
    }

    async function onChange(e) {
        try {
            const ipfs = await IPFS.create({ repo: "uploaded-files"});
            const file = e.target.files[0]
            const uploadedFile = ipfs.add(file);
            uploadedFile.then((res) => {
                changeImage("ipfs://" + res.path);
            });
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    return (
        <div id={styles.profile}>
            <h2>Profile</h2>
            <div>
                <div>
                    <p>{ownProfile?.name ? ownProfile.name : shortenIfAddress(ownProfile?.address)}</p>
                    <Edit type={EditType.Name}/>
                </div>
                <div>
                    <p>{ownProfile && ownProfile?.description ? ownProfile.description : ''}</p>
                    <Edit type={EditType.Description}/>
                </div>
            </div>
            <div>
                <label id={styles.addFileLabel} htmlFor={styles.addFile}>
                    <Image src={getProfileImage(ownProfile)} alt="Profile Image" height={"100%"} width={"100%"}/>
                    <div className={styles.imageOverlay}>Change</div>
                </label>
                <input 
                id={styles.addFile} 
                type="file" 
                onChange={() => window.open("https://clay.self.id/me/profile/edit")} 
                disabled={selfId === undefined}
                ></input>
            </div>
        </div>
    )
}

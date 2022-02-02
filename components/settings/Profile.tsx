import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { shortenIfAddress } from '@usedapp/core'
import styles from '../../styles/settings.module.css'
import { Edit } from '../utilities/Edit'
import { SelfID } from '@self.id/web'
import { BasicProfile } from '@datamodels/identity-profile-basic'

const IPFS = require('ipfs');

export const Profile = (props) => {
    const [profile, setProfile] = useState<BasicProfile>();
    const selfId: SelfID = props.selfId;
    const loadProfile = async () => {
        setProfile(await selfId.get('basicProfile'));
    }
    useEffect(() => {
        if(selfId)
            loadProfile();
        //Cleanup
        return () => {
            setProfile(undefined);
        }
    }, [selfId])

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
                    <p>{profile && profile.hasOwnProperty('name') ? profile.name : shortenIfAddress(props.address)}</p>
                    <Edit type='name' selfId={selfId} disabled={profile && profile.hasOwnProperty('name')}/>
                </div>
                <div>
                    <p>{profile && profile.hasOwnProperty('description') ? profile.description : ''}</p>
                    <Edit type='description' selfId={selfId} disabled={profile && profile.hasOwnProperty('description')}/>
                </div>
            </div>
            <div>
                <label id={styles.addFileLabel} htmlFor={styles.addFile}>
                    <Image src={profile && profile.hasOwnProperty('image') ? `https://ipfs.io/ipfs/${profile.image.alternatives[0].src.substring(7, profile.image.alternatives[0].src.length)}` : `https://robohash.org/${props.address}.png?set=set5`} alt="Profile Image" height={"100%"} width={"100%"}/>
                    <div className={styles.imageOverlay}>Change</div>
                </label>
                <input id={styles.addFile} type="file" onChange={() => window.open("https://clay.self.id/me/profile/edit")} disabled={selfId === undefined}></input>
            </div>
        </div>
    )
}

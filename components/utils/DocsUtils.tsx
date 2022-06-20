import Link from 'next/link'
import React from 'react'
import styles from '../../styles/docsutils.module.css'

interface links {
    name: string,
    description: string,
    url: string,
}

export function Feature({ links }: { links: links[] }) {
  return (
    <div className={styles.docsUtils}>
        {links.map(link => {
            return (
                <Link
                    key={link.name}
                    href={`/docs${link.url}`}
                    // target={'_blank'}
                    // rel={'noreferrer'}
                >
                    <a>
                        <div>
                            <p className={styles.docsUtilsArrow}>🡵</p>
                            <h6>{link.name}</h6>
                            <LightText>{link.description}</LightText>
                        </div>
                    </a>
                </Link>
            )
        })}
    </div>
  )
}

export function LightText({ children }: {children: React.ReactNode }){
    return(
        React.createElement('p', { className: styles.lightText }, children)
    )
}
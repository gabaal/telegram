'use client'

import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/clerk-react"
import { useMutation } from "convex/react"
import { useCallback, useEffect, useState } from "react"
import { LoadingSpinner } from "./LoadingSpinner"
import streamClient from "@/lib/stream"
import { NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER } from "next/dist/lib/constants"
import { createToken } from "@/actions/createToken"
import clsx from "clsx"


function UserSyncWrapper({ children }: { children: React.ReactNode }) {

    const { user, isLoaded: isUserLoaded } = useUser()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const createOrUpdateUser = useMutation(api.users.upsertUser)

    const syncUser = useCallback(async () => {
        if (!user?.id) return;

        try {
            setIsLoading(true)
            setError(null)

            const tokenProvider = async () => {
                if (!user?.id) {
                    throw new Error("User not authenticated")
                }
                const token = await createToken(user.id)
                return token;
            }

            await createOrUpdateUser({
                userId: user.id,
                name: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'Unknown',
                email: user.emailAddresses[0]?.emailAddress || '',
                imageUrl: user.imageUrl || '',
            })

            await streamClient.connectUser(
                {
                    id: user.id,
                name: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'Unknown',
                image: user.imageUrl || '',
                },
                tokenProvider
            )

        } catch (error) {
            setError("Failed to sync user")
        } finally {
            setIsLoading(false)
        }

    }, [user, createOrUpdateUser])


const disconnectUser = useCallback(async () => {
    try {
        await streamClient.disconnectUser()
    } catch (err) {
        console.log('failed to disconnect user', err)
    }
}, [])

useEffect(() => {
    if (!isUserLoaded) return;

    if (user) {
        syncUser()
    } else {
        disconnectUser()
        setIsLoading(false)
    }

    return () => {
        if (user) {
            disconnectUser()
        }
    }

}, [user, isUserLoaded, syncUser, disconnectUser])

    if (!isUserLoaded || isLoading) {
        return (
            <LoadingSpinner size='lg'
            message={!isUserLoaded ? 'Loading user...' : 'Syncing user...'}
            className='min-h-screen'/>
        )
    }

    if (error) {
        return (
            <div className="flex-1 items-center justify-center bg-white px-6">
                <p className="text-red-500">SYNC ERROR: {error}</p>
            </div>)
    }
    return (
        <>{children}</>
    )
}
export default UserSyncWrapper
'use client'

import { Doc } from "@/convex/_generated/dataModel"
import { useUserSearch } from "@/hooks/useUserSearch"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"
import { Mail, Search, UserIcon, X } from "lucide-react"
import { Input } from "./ui/input"
import { InlineSpinner } from "./LoadingSpinner"
import Image from "next/image"

function UserSearch({
    onSelectedUser,
    className,
    placeholder = "Search users by name or email..."
}: {
    onSelectedUser?: (user: Doc<"users">) => void,
    className?: string,
    placeholder?: string,
}) {

    const { searchTerm, setSearchTerm, searchResults, isLoading } = useUserSearch()
    const { user } = useUser()
    const filteredResults = searchResults.filter(u => u.userId !== user?.id)

    const handleSelectUser = (user: (typeof searchResults)[0]) => {
        onSelectedUser?.(user)
        setSearchTerm('')
    }

    const clearSearch = () => {
        setSearchTerm('')
    }

    return (
        <div className={cn("w-full max-w-2xl mx-auto", className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 pr-10 h-12 text-base"
                />
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {searchTerm.trim() && (
                <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            <div className="flex items-center justify-center space-x-2">
                                <InlineSpinner size='sm' />
                                <span>Searching...</span>
                            </div>
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                            <UserIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No users found matching &quot;{searchTerm}&quot;</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {filteredResults.map(user => (
                                <button
                                    key={user._id}
                                    onClick={() => handleSelectUser(user)}
                                    className={cn('w-full px-4 py-3 text-left hover:bg-accent',
                                        'border-b border-border last:border-b-0',
                                        'focus:outline-none focus:bg-accent')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Image
                                                src={user.imageUrl}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full bg-muted object-cover ring-2 ring-border"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <p className="font-medium text-foreground truncate">
                                                    {user.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1 mt-1">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <div className="h-2 w-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default UserSearch
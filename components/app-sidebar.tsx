'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { UserButton, useUser } from "@clerk/clerk-react"
import { ChannelList } from "stream-chat-react"
import { ChannelFilters, ChannelSort } from "stream-chat"
import { NewChatDialog } from "./NewChatDialog"




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {user} = useUser()

  const filters: ChannelFilters= {
    members: { $in: [user?.id as string ] },
    type: { $in: ['messaging', 'team'] }
  }
  const options = { presence: true, state: true }
  const sort: ChannelSort = { last_message_at: -1 }

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Welcome back</span>
                  <span className="text-xs font-semibold">{user?.firstName} {user?.lastName}</span>
                </div>
                <UserButton signInUrl='sign-in'/>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <NewChatDialog>
            <Button className="w-full" variant="outline">Start New Chat</Button>
</NewChatDialog>
<ChannelList
  filters={filters}
  options={options}
  sort={sort}
  limit={10}
  showHeader={false}
  showSearch={false}
  showChannelSearch={false}

  EmptyStateIndicator={(() => (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="text-6xl mb-6 opacity-20">💬</div>
      <h2 className="text-xl font-medium text-foreground mb-2">Ready to chat?</h2>
      <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-[200px]">Your conversations will appear here once you start chatting with others.</p>
    </div>
  ))}
/>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

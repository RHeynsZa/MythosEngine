import { createFileRoute } from '@tanstack/react-router'
import UserProfilePage from '../../components/profile/UserProfilePage'

export const Route = createFileRoute('/profile/$username')({
  component: UserProfilePage,
})
import { useState, useEffect, useCallback, useRef } from 'react'
import type { Invitation } from '../api/invitations'
import { invitationsApi } from '../api/invitations'
import { useToast } from './useToast'

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const { success, error: toastError } = useToast()
  const isFirstRender = useRef(true)

  const loadPendingInvitations = useCallback(async (showErrorToast: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      const response = await invitationsApi.getPendingInvitations()
      
      let invitationsData: Invitation[] = []
      
      if (response && response.success !== false) {
        if (response.data && Array.isArray(response.data)) {
          invitationsData = response.data
        } else if (Array.isArray(response)) {
          invitationsData = response
        }
      }
      
      setInvitations(invitationsData)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load pending invitations'
      setError(message)
      setInvitations([])
      if (showErrorToast) {
        toastError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [toastError])

  const sendInvitation = useCallback(
    async (email: string, role: string = 'MEMBER') => {
      try {
        setSending(true)
        setError(null)
        const validRole = role as 'ADMIN' | 'MEMBER' | 'VIEWER'
        const response = await invitationsApi.createInvitation({ email, role: validRole })
        success(`Invitation sent to ${email}`)
        await loadPendingInvitations(true)
        return { success: true, data: response.data }
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to send invitation'
        setError(message)
        toastError(message)
        return { success: false, error: message }
      } finally {
        setSending(false)
      }
    },
    [loadPendingInvitations, success, toastError]
  )

  const cancelInvitation = useCallback(
    async (invitationId: string): Promise<void> => {
      try {
        setCancelling(invitationId)
        setError(null)
        await invitationsApi.cancelInvitation(invitationId)
        success('Invitation cancelled successfully')
        await loadPendingInvitations(true)
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to cancel invitation'
        setError(message)
        toastError(message)
        throw err
      } finally {
        setCancelling(null)
      }
    },
    [loadPendingInvitations, success, toastError]
  )

  const resendInvitation = useCallback(
    async (invitationId: string): Promise<void> => {
      try {
        setCancelling(invitationId)
        setError(null)
        await invitationsApi.resendInvitation(invitationId)
        success('Invitation resent successfully')
        await loadPendingInvitations(true)
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to resend invitation'
        setError(message)
        toastError(message)
        throw err
      } finally {
        setCancelling(null)
      }
    },
    [loadPendingInvitations, success, toastError]
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      loadPendingInvitations(false)
    }
  }, [loadPendingInvitations])

  return {
    invitations,
    loading,
    error,
    sending,
    cancelling,
    loadPendingInvitations,
    sendInvitation,
    cancelInvitation,
    resendInvitation
  }
}
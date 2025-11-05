// screens/Home/sideMenuScreens/ReservationHistory/hooks/useReservations.js
import { useState, useEffect, useCallback } from "react"
import { getUserReservations } from "../../../../../services/reservationHistoryService"
import { supabase } from '../../../../../utils/supabase'

export default function useReservations() {
  const [reservations, setReservations] = useState([])
  const [currentReservations, setCurrentReservations] = useState([])
  const [pastReservations, setPastReservations] = useState([])
  const [stats, setStats] = useState({ 
    completed: 0, 
    upcoming: 0, 
    cancelled: 0, 
    total: 0 
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const fetchReservations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      const { data: resident, error: residentError } = await supabase
        .from('residents')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (residentError) {
        console.error('Error fetching resident:', residentError)
        setError("Could not load resident profile")
        setLoading(false)
        return
      }

      const result = await getUserReservations(resident.id)
      
      if (result.error) {
        setError(result.error)
      } else {
        setReservations(result.reservations)
        setStats(result.stats)
        
        // Separate current and past reservations
        const current = result.reservations.filter(r => 
          r.status === 'upcoming' || r.status === 'pending'
        )
        const past = result.reservations.filter(r => 
          r.status === 'completed' || r.status === 'cancelled'
        )
        
        setCurrentReservations(current)
        setPastReservations(past)
        setError(null)
      }
    } catch (err) {
      console.error('Error in fetchReservations:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchReservations()
  }, [fetchReservations])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchReservations()
  }, [fetchReservations])

  return {
    reservations,
    currentReservations,
    pastReservations,
    stats,
    loading,
    refreshing,
    error,
    onRefresh,
    retry
  }
}
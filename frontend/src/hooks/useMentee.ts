import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'

export function useMenteeStats() {
  return useQuery({
    queryKey: ['mentee', 'stats'],
    queryFn: () => api.get('/mentee/me/stats').then(r => r.data),
  })
}

export function useMenteeRoadmap() {
  return useQuery({
    queryKey: ['mentee', 'roadmap'],
    queryFn: () => api.get('/mentee/me/roadmap').then(r => r.data),
    staleTime: 1000 * 60 * 10,
  })
}

export function useMenteeSubmissions() {
  return useQuery({
    queryKey: ['mentee', 'submissions'],
    queryFn: () => api.get('/mentee/me/submissions').then(r => r.data),
  })
}

export function useCreateSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      weekNumber: number
      summary: string
      workDone: string
      link?: string
    }) => api.post('/mentee/me/submissions', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee'] })
    },
  })
}
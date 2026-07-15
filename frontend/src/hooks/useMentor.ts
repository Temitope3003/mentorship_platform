import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'

export function useMentorStats() {
  return useQuery({
    queryKey: ['mentor', 'stats'],
    queryFn: () => api.get('/mentor/stats').then(r => r.data),
  })
}

export function useMentorAnalytics() {
  return useQuery({
    queryKey: ['mentor', 'analytics'],
    queryFn: () => api.get('/mentor/analytics').then(r => r.data),
  })
}

export function useMentees() {
  return useQuery({
    queryKey: ['mentor', 'mentees'],
    queryFn: () => api.get('/mentor/mentees').then(r => r.data),
  })
}

export function useAllSubmissions() {
  return useQuery({
    queryKey: ['mentor', 'submissions'],
    queryFn: () => api.get('/mentor/submissions').then(r => r.data),
  })
}

export function useAccessCodes() {
  return useQuery({
    queryKey: ['mentor', 'codes'],
    queryFn: () => api.get('/mentor/codes').then(r => r.data),
  })
}

export function useAddFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
      api.post(`/mentor/submissions/${id}/feedback`, { feedback }).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor', 'submissions'] })
    },
  })
}

export function useMotivationalMessages() {
  return useQuery({
    queryKey: ['mentor', 'motivational-messages'],
    queryFn: () => api.get('/mentor/motivational-messages').then(r => r.data),
  })
}

export function useCreateMentee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; domain: string }) =>
      api.post('/mentor/mentees', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor'] })
    },
  })
}
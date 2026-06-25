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

export function useStartJourney() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/mentee/me/start').then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee'] })
    },
  })
}

export function usePauseJourney() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reason?: string) => api.post('/mentee/me/pause', { reason }).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee'] })
    },
  })
}

export function useResumeJourney() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/mentee/me/resume').then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee'] })
    },
  })
}

export function useSubmitPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { paymentReference: string; pendingPaymentPlan: 'MONTHLY' | 'YEARLY' }) =>
      api.post('/mentee/me/submit-payment', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee'] })
    },
  })
}

export function useRequestCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/mentee/me/request-certificate').then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentee'] })
    },
  })
}

export function useRequestRecommendationLetter() {
  return useMutation({
    mutationFn: () => api.post('/mentee/me/request-recommendation-letter').then(r => r.data),
  })
}

export async function downloadMyCertificate() {
  const res = await api.get('/mentee/me/certificate', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'BuildInTech-Certificate-of-Completion.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
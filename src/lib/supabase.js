import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ijkekyxqoudkevcntmgy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqa2VreXhxb3Vka2V2Y250bWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDUyMDIsImV4cCI6MjA5NzUyMTIwMn0.gPjGJMNmSrKoPaehHDLOE3vUNF2gdD24C3gvc1LYHyU'

export const supabase = createClient(supabaseUrl, supabaseKey)

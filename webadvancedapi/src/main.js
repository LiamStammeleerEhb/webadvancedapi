import './style.css'
import '../src/scss/style.scss'
import * as bootstrap from 'bootstrap'

// In PHP heb je een "include" functie... In javascript niet. Dus heb ik deze methode gebruikt
import { api } from './api.js'

// Start de api codee
api();
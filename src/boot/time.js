import _ from 'lodash'
import logger from 'loglevel'
import moment from 'moment'
import { useStore } from './store.js'
import { getLocale } from '../utils/utils.locale.js'

// Export singleton
export const Time = {
  initialize () {
    // Timer for realtime mode
    this.timer = null
    // Set locale globally
    moment.locale(getLocale())
    // Set the time object within the store
    const now = moment.utc()
    const start = now.clone().subtract(1, 'months').startOf('day')
    const end = now.clone().endOf('day')
    useStore().setTime({
      range: {
        start,
        end,
        field: 'createdAt',
        query: { createdAt: { $gte: start.toISOString(), $lte: end.toISOString() } }
      },
      format: {
        time: {
          short: 'H[h]',
          long: 'HH:mm'
        },
        date: {
          short: 'DD/MM',
          long: 'dddd D'
        },
        year: {
          short: 'YY',
          long: 'YYYY'
        }
      },
      currentTime: now,
      realtime: false,
      step: 60, // 1H
      interval: 60 // 1m
    })
  }
}

export default ({ app }) => {
  // Initializes time
  Time.initialize()
}

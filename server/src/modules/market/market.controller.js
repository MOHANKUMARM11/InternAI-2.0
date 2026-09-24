import * as marketService from './market.service.js'

export const getPulse = async (req, res, next) => {
  try {
    const pulse = await marketService.getPulse()
    res.status(200).json({ success: true, data: pulse })
  } catch (err) {
    next(err)
  }
}

export const getTrending = async (req, res, next) => {
  try {
    const trending = await marketService.getTrending()
    res.status(200).json({ success: true, data: trending })
  } catch (err) {
    next(err)
  }
}

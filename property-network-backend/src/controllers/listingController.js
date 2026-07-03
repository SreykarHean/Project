const listingService = require('../services/listingService')

const createListing = async (req, res, next) => {
  try {
    const listing = await listingService.createListing(req.user.id, req.body)
    res.status(201).json({ success: true, message: 'Listing created', data: listing })
  } catch (err) {
    next(err)
  }
}

const getAllListings = async (req, res, next) => {
  try {
    const listings = await listingService.getAllListings(req.query)
    res.json({ success: true, data: listings })
  } catch (err) {
    next(err)
  }
}

const getListingById = async (req, res, next) => {
  try {
    const listing = await listingService.getListingById(req.params.id)
    res.json({ success: true, data: listing })
  } catch (err) {
    next(err)
  }
}

const updateListing = async (req, res, next) => {
  try {
    const listing = await listingService.updateListing(req.params.id, req.user.id, req.body)
    res.json({ success: true, message: 'Listing updated', data: listing })
  } catch (err) {
    next(err)
  }
}

const deleteListing = async (req, res, next) => {
  try {
    await listingService.deleteListing(req.params.id, req.user.id, req.user.role)
    res.json({ success: true, message: 'Listing deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createListing, getAllListings, getListingById, updateListing, deleteListing }
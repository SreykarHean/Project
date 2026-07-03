const { Listing, ListingDetail, ListingPhoto, Agent } = require('../models')

const createListing = async (agentId, data) => {
  const listing = await Listing.create({
    ...data,
    agent_id: agentId,
  })
  return listing
}

const getAllListings = async (query) => {
  const where = {}

  if (query.city) where.city = query.city
  if (query.property_type) where.property_type = query.property_type
  if (query.status) where.status = query.status

  const listings = await Listing.findAll({
    where,
    include: [
      { model: Agent, attributes: ['full_name', 'agency_name', 'phone'] },
      { model: ListingPhoto, attributes: ['photo_path', 'display_order'] },
    ],
  })
  return listings
}

const getListingById = async (id) => {
  const listing = await Listing.findByPk(id, {
    include: [
      { model: Agent, attributes: ['full_name', 'agency_name', 'phone'] },
      { model: ListingDetail },
      { model: ListingPhoto },
    ],
  })
  if (!listing) throw new Error('Listing not found')
  return listing
}

const updateListing = async (id, agentId, data) => {
  const listing = await Listing.findByPk(id)
  if (!listing) throw new Error('Listing not found')
  if (listing.agent_id !== agentId) throw new Error('Unauthorized')
  await listing.update(data)
  return listing
}

const deleteListing = async (id, userId, role) => {
  const listing = await Listing.findByPk(id)
  if (!listing) throw new Error('Listing not found')
  if (role !== 'admin' && listing.agent_id !== userId) throw new Error('Unauthorized')
  await listing.destroy()
}

module.exports = { createListing, getAllListings, getListingById, updateListing, deleteListing }
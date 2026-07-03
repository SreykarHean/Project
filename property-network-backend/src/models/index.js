const sequelize = require('../config/database')

const Admin = require('./Admin')
const Buyer = require('./Buyer')
const Agent = require('./Agent')
const Appointment = require('./Appointment')
const Listing = require('./Listing')
const ListingComparison = require('./ListingComparison')
const ListingDetail = require('./ListingDetail')
const ListingPhoto = require('./ListingPhoto')
const Message = require('./Message')
const Notification = require('./Notification')
const QaQuestion = require('./QaQuestion')
const QaAnswer = require('./QaAnswer')
const Report = require('./Report')
const Review = require('./Review')
const SavedListing = require('./SavedListing')
const SavedSearch = require('./SavedSearch')

//Listing Associations
Listing.belongsTo(Agent, {foreignKey: 'agent_id'})
Agent.hasMany(Listing, {foreignKey: 'agent_id'})
 
Listing.belongsTo(Admin, {foreignKey: 'admin_id'})
Admin.hasMany(Listing, {foreignKey: 'admin_id'})

Listing.hasOne(ListingDetail, {foreignKey: 'listing_id'})
ListingDetail.belongsTo(Listing, {foreignKey: 'listing_id'})

Listing.hasMany(ListingPhoto, {foreignKey: 'listing_id'})
ListingPhoto.belongsTo(Listing, {foreignKey: 'listing_id'})

// Buyer associations
Buyer.hasMany(SavedListing, { foreignKey: 'buyer_id' })
SavedListing.belongsTo(Buyer, { foreignKey: 'buyer_id' })
SavedListing.belongsTo(Listing, { foreignKey: 'listing_id' })
Listing.hasMany(SavedListing, { foreignKey: 'listing_id' })

Buyer.hasMany(Appointment, { foreignKey: 'buyer_id' })
Appointment.belongsTo(Buyer, { foreignKey: 'buyer_id' })
Appointment.belongsTo(Listing, { foreignKey: 'listing_id' })
Listing.hasMany(Appointment, { foreignKey: 'listing_id' })

Buyer.hasMany(Review, { foreignKey: 'buyer_id' })
Review.belongsTo(Buyer, { foreignKey: 'buyer_id' })
Review.belongsTo(Agent, { foreignKey: 'agent_id' })
Agent.hasMany(Review, { foreignKey: 'agent_id' })

Buyer.hasMany(SavedSearch, { foreignKey: 'buyer_id' })
SavedSearch.belongsTo(Buyer, { foreignKey: 'buyer_id' })

Buyer.hasMany(ListingComparison, { foreignKey: 'buyer_id' })
ListingComparison.belongsTo(Buyer, { foreignKey: 'buyer_id' })

// Q&A
QaQuestion.belongsTo(Buyer, { foreignKey: 'buyer_id' })
QaQuestion.belongsTo(Listing, { foreignKey: 'listing_id' })
Buyer.hasMany(QaQuestion, { foreignKey: 'buyer_id' })
Listing.hasMany(QaQuestion, { foreignKey: 'listing_id' })

QaAnswer.belongsTo(QaQuestion, { foreignKey: 'question_id' })
QaAnswer.belongsTo(Agent, { foreignKey: 'agent_id' })
QaQuestion.hasMany(QaAnswer, { foreignKey: 'question_id' })
Agent.hasMany(QaAnswer, { foreignKey: 'agent_id' }) 

// Messages
Message.belongsTo(Buyer, { foreignKey: 'buyer_id' })
Message.belongsTo(Agent, { foreignKey: 'agent_id' })
Buyer.hasMany(Message, { foreignKey: 'buyer_id' })
Agent.hasMany(Message, { foreignKey: 'agent_id' })

// Notifications
Notification.belongsTo(Buyer, { foreignKey: 'buyer_id' })
Buyer.hasMany(Notification, { foreignKey: 'buyer_id' })
Notification.belongsTo(Agent, { foreignKey: 'agent_id' })
Agent.hasMany(Notification, { foreignKey: 'agent_id' })

// Reports
Report.belongsTo(Buyer, { foreignKey: 'buyer_id' })
Report.belongsTo(Listing, { foreignKey: 'listing_id' })
Buyer.hasMany(Report, { foreignKey: 'buyer_id' })
Listing.hasMany(Report, { foreignKey: 'listing_id' })
Report.belongsTo(Admin, { foreignKey: 'admin_id' })
Admin.hasMany(Report, { foreignKey: 'admin_id' })

module.exports = {
    sequelize,
    Agent, Admin, Appointment, Buyer, Listing, ListingComparison, ListingDetail, ListingPhoto, Message, Notification, QaAnswer, QaQuestion, Report, Review, SavedListing, SavedSearch,
}